namespace MeinStudManager.Models;

public static class RoleHelper
{
    public const string Role_Administrators = "Administrators";
    public const string Role_Moderators = "Moderators";
    public const string Role_Students = "Students";

    public const string Auth_Role_Administrators = $"{Role_Administrators}";
    public const string Auth_Role_Moderators = $"{Role_Administrators},{Role_Moderators}";
    public const string Auth_Role_Students = $"{Role_Administrators},{Role_Moderators},{Role_Students}";

    public const string Auth_Role_Administrators_Only = Role_Administrators;
    public const string Auth_Role_Moderators_Only = Role_Moderators;
    public const string Auth_Role_Students_Only = Role_Students;
}