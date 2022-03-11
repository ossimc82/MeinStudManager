using System.Net.Mime;
using System.Reflection;
using System.Text;
using MeinStudManager.Authorization;
using MeinStudManager.Data;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace MeinStudManager
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                var keyFile = File.ReadAllText("dbAccess.key").Split('\t');
                var connStr = $"Server=api.smstuds.de;Database={keyFile[0]}_msm;Uid={keyFile[0]};Pwd={keyFile[1]};";
                
                options.UseMySql(connStr, ServerVersion.AutoDetect(connStr));
            });

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
                    options.User.RequireUniqueEmail = true)
                .AddRoles<IdentityRole>()
                .AddRoleManager<RoleManager<IdentityRole>>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new ProducesAttribute(MediaTypeNames.Application.Json));
                //BUG BUG
                //Adding consumes to the filters breaks all GET requests (404)
                //because GET requests do not have a body (Maybe gets fixed with .NET7)
                //options.Filters.Add(new ConsumesAttribute(MediaTypeNames.Application.Json));

                //General response types
                options.Filters.Add(
                    new ProducesResponseTypeAttribute(typeof(ProblemDetails), StatusCodes.Status400BadRequest));
                options.Filters.Add(new ProducesResponseTypeAttribute(StatusCodes.Status500InternalServerError));
            });

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "MeinStudManager backend API",
                    Description = "The backend documentation from MeinStudManager"
                });

                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });


                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var path = Path.Combine(AppContext.BaseDirectory, xmlFilename);
                if (File.Exists(path))
                    options.IncludeXmlComments(path);
                else
                    Console.WriteLine($"XML Documentation file not found at \"{path}\"\nMake sure \"GenerateDocumentationFile\" is set to true in the csproj");
            });

            var jwtSettings = Configuration.GetSection("JwtSettings");
            var jwtHandler = new MsmJwtSecurityTokenHandler();
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.GetSection("validIssuer").Value,
                    ValidAudience = jwtSettings.GetSection("validAudience").Value,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.GetSection("securityKey").Value))
                };
                options.SecurityTokenValidators.Clear();
                options.SecurityTokenValidators.Add(jwtHandler);
            });

            services.AddSingleton(jwtHandler);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<ForumManager>();
            //Add other services here
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider, IWebHostEnvironment env, ApplicationDbContext dbContext)
        {
            dbContext.Database.Migrate();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            var jwtHandler = serviceProvider.GetService<MsmJwtSecurityTokenHandler>()!;
            jwtHandler.Configure(serviceProvider);

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapFallbackToFile("index.html");
            });
            
            //Create a default admin user
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>()!;
            if (userManager.Users.Any())
                return;

            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>()!;

            var user = new ApplicationUser
            {
                Email = "admin@admin.com",
                EmailConfirmed = true,
                UserName = "admin"
            };

            Task.Run(async () =>
            {
                var results = new[]
                {
                    await userManager.CreateAsync(user, "Admin.69"),
                    await roleManager.CreateAsync(new IdentityRole(RoleHelper.Role_Administrators)),
                    await roleManager.CreateAsync(new IdentityRole(RoleHelper.Role_Moderators)),
                    await roleManager.CreateAsync(new IdentityRole(RoleHelper.Role_Students))
                };

                if (!results.All(x => x.Succeeded))
                    return;

                await userManager.AddToRoleAsync(user, RoleHelper.Role_Administrators);
            }).Wait();
        }
    }
}
