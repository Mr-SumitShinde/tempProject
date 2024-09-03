1. setDefault MethodDescription: The setDefault method allows you to define default configuration settings for all requests made through an instance of ValpreAPI. This configuration can include settings such as baseURL, headers, timeout, and others, ensuring that these defaults are applied automatically to every request, unless explicitly overridden.Usage:api.setDefault({
    baseURL: 'https://api.example.com',
    timeout: 5000,
    headers: {
        'Authorization': 'Bearer token'
    }
});Key Points:Default settings simplify the configuration process by reducing the need to specify the same settings repeatedly for every request.Defaults can be overridden on a per-request basis by specifying different options when making a request.2. create MethodDescription: The create method is a static function that allows you to create a new instance of ValpreAPI with a custom configuration. This method is particularly useful when you need to work with multiple APIs or when you want to maintain different configurations for different instances.Usage:const customAPI = ValpreAPI.create({
    baseURL: 'https://custom-api.example.com',
    timeout: 10000
});Key Points:create returns a new ValpreAPI instance, separate from any existing instances.Each instance created using create can have its own configuration and defaults, allowing for flexibility when working with different APIs or services.These descriptions should help clarify the purpose and usage of the setDefault and create methods in your documentation.