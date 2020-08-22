using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace DitsPortal.Common.StaticResources
{
    public class UploadImage
    {
        public static string saveImageInFolder(string img, string type)
        {
            string basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            byte[] imageBytes = Convert.FromBase64String(img);
            MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length);


            string newFile = "";

            if (type == "PNG")
            {
                newFile = Guid.NewGuid().ToString() + ".png";
            }
            else
            {
                newFile = Guid.NewGuid().ToString() + ".jpg";
            }

            var FilePath = Path.Combine(basePath, "Uploads", "Photos");
            //var FilePath = basePath + "\\Uploads\\Photos";
            var path = Path.Combine(FilePath, newFile);

            bool exists = System.IO.Directory.Exists(FilePath);

            if (!exists)
            {
                System.IO.Directory.CreateDirectory(FilePath);
            }


            if (imageBytes.Length > 0)
            {
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    stream.Write(imageBytes, 0, imageBytes.Length);
                    stream.Flush();
                }
            }

            path = path.Replace(basePath, "").Replace("\\", "/");
            return path;

        }

    }
}
