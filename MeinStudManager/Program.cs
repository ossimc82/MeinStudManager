using MeinStudManager;

if (!File.Exists("dbAccess.key") && !File.Exists("dbConnstr.txt"))
{
    Console.WriteLine("No database access key or connection string file found.");
    Console.WriteLine("Please place a \"dbAccess.key\" or \"dbConnstr.txt\" file in the application directory");
    Console.ReadKey();
    return;
}

CreateHostBuilder(args).Build().Run();

IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());