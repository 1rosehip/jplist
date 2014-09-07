using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Reflection;
using System.Web;

namespace JPList.Log
{
    public class Logger
    {
        public static string FilePath = "log.txt"; //Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + 
               
        /// <summary>
        /// error log
        /// </summary>
        /// <param name="msg"></param>
        public static void Error(string msg)
        {
            /*
            HttpContext.Current.Response.Write(msg);

            
            using (StreamWriter file = new StreamWriter(HttpContext.Current.Server.MapPath(FilePath), true))
            {
                file.WriteLine("Error: " + msg);
            }
             * */
        }

        /// <summary>
        /// error log
        /// </summary>
        /// <param name="msg"></param>
        public static void Info(string msg)
        {
            /*
            HttpContext.Current.Response.Write(msg);

            
            using (StreamWriter file = new StreamWriter(HttpContext.Current.Server.MapPath(FilePath), true))
            {
                file.WriteLine("Info: " + msg);
            }
             * */
        }
    }
}
