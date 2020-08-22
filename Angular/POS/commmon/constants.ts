// Base Url 
export const Host_URL: string = 'http://localhost:51315';

export class Constants {
    // ckyb function API url 
    public static get Save_ckyb(): string { return Host_URL + "/kyb/Saveckyb"; };
    public static get GetAll_ckyb(): string { return Host_URL + "/kyb/GetAllckyb"; };

    // ckyba function API url
    public static get GetAll_ckyba(): string { return Host_URL + "/kyba/GetAllckyba"; };
    public static get UpdateAll_ckyba(): string { return Host_URL + "/kyba/UpdateAllckyba"; };

}