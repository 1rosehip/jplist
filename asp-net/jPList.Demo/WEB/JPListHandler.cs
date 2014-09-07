using System;
using System.Collections.Generic;
using System.Web;
using System.Diagnostics;
using System.Text;
using System.Data.Common;

using Newtonsoft.Json;

using JPList.DAL;
using JPList.Domain.Models;
using JPList.Log;
using System.Reflection;
using System.IO;

namespace JPList.WEB
{
    /// <summary>
    /// JPlist Web Handler
    /// </summary>
    public class JPListHandler : IHttpHandler
    {
        /// <summary>
        /// get html by items list
        /// </summary>
        /// <param name="items">itmes list</param>
        /// <returns>html</returns>
        private string GetHTML(List<Item> items, int count)
        {
            StringBuilder html = new StringBuilder();

            try
            {
                html.Append("<div data-type='jplist-dataitem' data-format='html' data-count='" + count + "' class='box'>");

                foreach (Item item in items)
                {
                    html.AppendLine("<div class='list-item box'>");	
		            html.AppendLine("<div class='img left'>");	
		            html.AppendLine("	<img src='" + item.Image + "' alt='' title=''/>");	
		            html.AppendLine("</div>");	
			
		            html.AppendLine("<div class='block right'>");
		            html.AppendLine("	<p class='title'>" + item.Title + "</p>");	
		            html.AppendLine("	<p class='desc'>" + item.Description + "</p>");	
		            html.AppendLine("	<p class='like'>" + item.Likes + " Likes</p>");	
		            html.AppendLine("	<p class='theme'>" + item.Keyword1 + ", " + item.Keyword2 + "</p>");	
		            html.AppendLine("</div>");	
		            html.AppendLine("</div>");	
                }

		        html.Append("</div>");	
            }
            catch (Exception ex)
            {
                Logger.Error("JPList GetHTML: " + ex.Message + " " + ex.StackTrace);
            }

            return html.ToString();
        }

        /// <summary>
        /// entry point
        /// </summary>
        /// <param name="context"></param>
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/html";

            string statuses;
            List<StatusDTO> statusesList;
            StatusQueries statusQueries;
            DataBase db;

            string countQuery, selectQuery;
            int count = 0;
            List<Item> items;

            try
            {
                items = new List<Item>();
                
                //get statuses
                statuses = context.Request.Form.Get("statuses");
                
                if (!String.IsNullOrEmpty(statuses))
                {
                    //decode the url
                    statuses = context.Server.UrlDecode(statuses);
                    statusesList = JsonConvert.DeserializeObject<List<StatusDTO>>(statuses);

                    if (statusesList != null)
                    {
                        //init status queries provider
                        statusQueries = new StatusQueries(statusesList);

                        //init database
                        db = new DataBase();

                        countQuery = statusQueries.GetCountQuery();
                        
                        if (!String.IsNullOrEmpty(countQuery))
                        {
                            count = db.GetNumber(countQuery, statusQueries.Parameters);
                        }

                        selectQuery = statusQueries.GetSelectQuery(count);
                                                
                        if (!String.IsNullOrEmpty(selectQuery))
                        {
                            items = db.Select(selectQuery, statusQueries.Parameters);
                        }
                    }
                 
                }

                //draw html
                context.Response.Write(this.GetHTML(items, count));
            }
            catch (Exception ex)
            {
                Logger.Error("JPList Web: " + ex.Message + " " + ex.StackTrace);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
