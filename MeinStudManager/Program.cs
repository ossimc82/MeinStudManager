using MeinStudManager;

if (!File.Exists("dbAccess.key"))
{
    Console.WriteLine("No database access key file found.");
    Console.ReadKey();
    return;
}

CreateHostBuilder(args).Build().Run();

IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());