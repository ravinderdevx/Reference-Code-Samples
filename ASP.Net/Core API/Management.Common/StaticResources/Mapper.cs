using DitsPortal.Common.Responses;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace DitsPortal.Common.StaticResources
{
    public static class Mapper
    {
        public static string convert<T>(MainResponse mainReponse)
        {

            Response<T> response = new Response<T>();
            response.Message = mainReponse.Message;
            response.Status = mainReponse.Status;

            if (mainReponse.Status == true)
            {
                string genericClassName = typeof(T).Name;

                if (genericClassName != string.Empty && char.IsUpper(genericClassName[0]))
                {
                    genericClassName = char.ToLower(genericClassName[0]) + genericClassName.Substring(1);
                }

                PropertyInfo propertyData = mainReponse.GetType().GetProperty(genericClassName);
                T data = (T)(propertyData.GetValue(mainReponse, null));

                response.Data = data;
            }

            return JsonConvert.SerializeObject(response);
        }
    }
}
