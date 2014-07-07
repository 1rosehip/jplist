using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

using JPList.Domain.Models;
using JPList.Log;

namespace JPList.DAL
{
    public class StatusQueries
    {
        private StringBuilder FilterQuery = new StringBuilder();
        private StringBuilder SortQuery = new StringBuilder();
        private StatusDTO PaginationStatus;

        /// <summary>
        /// unnamed parameters list
        /// </summary>
        public List<string> Parameters { get; set; }
        
        /// <summary>
        /// status queries
        /// </summary>
        /// <param name="statuses"></param>
        public StatusQueries(List<StatusDTO> statuses)
        {            
            try
            {
                this.Parameters = new List<string>();
                this.PaginationStatus = null;

                if (statuses != null)
                {
                    foreach(StatusDTO status in statuses)
                    {
                        switch(status.action)
                        {
                            case "paging":
                            {
                                this.PaginationStatus = status;
                                break;
                            }

                            case "filter":
                            {
                                this.FilterQuery.Append(this.getFilterQuery(status, this.FilterQuery.ToString(), this.Parameters));
                                break;
                            }

                            case "sort":
                            {
                                this.SortQuery.Append(this.getSortQuery(status, this.Parameters));
                                break;
                            }
                        }

                    }  
                }
                
            }
            catch (Exception ex)
            {
                 Logger.Error("StatusQueries: " + ex.Message + " " + ex.StackTrace);
            }
        }

        #region "Public Methods"

        /// <summary>
        /// get count query
        /// </summary>
        /// <returns>sql query</returns>
        public string GetCountQuery()
        {
            string query = "";

            try
            {
                //count database items for pagination
                query = "SELECT count(*) FROM Item " + this.FilterQuery.ToString();
            }
            catch (Exception ex)
            {
                 Logger.Error("GetCountQuery: " + ex.Message + " " + ex.StackTrace);
            }

            return query;
        }

        /// <summary>
        /// get select query
        /// </summary>
        /// <param name="count">pagination count</param>
        /// <returns>sql query</returns>
        public string GetSelectQuery(int count)
        {
            string query = "";

            try
            {
                query = "SELECT title, description, image, likes, keyword1, keyword2 FROM Item " + this.FilterQuery.ToString() + " " + this.SortQuery.ToString();

                if (this.PaginationStatus != null)
                {
                    query = this.getPagingQuery(this.PaginationStatus, count, this.Parameters, query);
                }
            }
            catch (Exception ex)
            {
                 Logger.Error("GetSelectQuery: " + ex.Message + " " + ex.StackTrace);
            }

            return query;
        }

        #endregion

        #region "Private Methods"

        /// <summary>
        /// get query for checkbox group filter
        /// </summary>
        /// <param name="keyword">db field</param>
        /// <param name="pathGroup">list of jquery paths</param>
        /// <param name="parameters">prepeared parameters</param>
        /// <returns></returns>
        private string getCheckboxGroupFilterQuery(string keyword, List<string> pathGroup, List<string> parameters)
        {
            StringBuilder query = new StringBuilder();
            string path;

            try
            {
                for (int i = 0; i < pathGroup.Count; i++)
                {
                    path = pathGroup[i].Replace(".", "");

                    if (i != 0)
                    {
                        query.Append(" or ");
                    }

                    query.Append(" " + keyword + " like @p" + (parameters.Count) + " ");
                    parameters.Add(path);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("getCheckboxGroupFilterQuery: " + ex.Message + " " + ex.StackTrace);
            }

            return query.ToString();
        }

        /// <summary>
        /// get pagination query
        /// </summary>
        /// <param name="status">the status object</param>
        /// <param name="count">all items number (after the filters were applied)</param>
        /// <param name="parameters">unnamed parameters list</param>
        /// <returns></returns>
        private string getPagingQuery(StatusDTO status, int count, List<string> parameters, string initialQuery)
        {
            StringBuilder query = new StringBuilder();
            int startIndex, endIndex;
            string order = " order by id ";

            try
            {
                if (status != null && status.data != null && count > status.data.number)
                {
                    startIndex = status.data.currentPage * status.data.number;
                    endIndex = startIndex + status.data.number;

                    if (!String.IsNullOrEmpty(this.SortQuery.ToString()))
                    {
                        order = this.SortQuery.ToString();
                    }

                    query.AppendLine(" SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( " + order + " ) as row FROM Item " + this.FilterQuery.ToString() + ") a WHERE row > " + startIndex + " and row <=  " + endIndex);
                }
                else
                {
                    query.AppendLine(initialQuery);
                }
            }
            catch (Exception ex)
            {
                 Logger.Error("getPagingQuery: " + ex.Message + " " + ex.StackTrace);
            }

            return query.ToString();
        }

        /// <summary>
        /// get sort query per status
        /// </summary>
        /// <param name="status">the status object</param>
        /// <param name="parameters">unnamed parameters list</param>
        /// <returns>query part</returns>
        private string getSortQuery(StatusDTO status, List<string> parameters)
        {
            string query = "";
            string order = "asc";

            try
            {
                if (status != null && status.data != null && !String.IsNullOrEmpty(status.data.path))
                {
                    switch (status.data.path)
                    {
                        case ".title":{
					        query = " order by title ";
					        break;
				        }
				
				        case ".desc":{
					        query = " order by description ";
					        break;
				        }
				
				        case ".like":{
					        query = " order by likes ";
					        break;
				        }
                    }

                    if (!String.IsNullOrEmpty(status.data.order))
                    {
                        order = status.data.order.ToLower() == "desc" ? "desc" : "asc";

                        if (!String.IsNullOrEmpty(query))
                        {
                            query += " " + order;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                 Logger.Error("getSortQuery: " + ex.Message + " " + ex.StackTrace);
            }

            return query;
        }

        /// <summary>
        /// get filter query per status
        /// </summary>
        /// <param name="status">the status object</param>
        /// <param name="prevQuery">previous query string</param>
        /// <param name="parameters">unnamed parameters list</param>
        /// <returns>query part</returns>
        private string getFilterQuery(StatusDTO status, string prevQuery, List<string> parameters)
        {
            string query = "";
            string filter = "";
           
            try
            {
                if (status != null && status.data != null && !String.IsNullOrEmpty(status.name))
                {
                    switch (status.name)
                    {
                        case "title-filter":
                            {
                                if (!String.IsNullOrEmpty(status.data.path) && !String.IsNullOrEmpty(status.data.value))
                                {
                                    if (prevQuery.IndexOf("where") == -1)
                                    {
                                        query = "where title like @p" + (parameters.Count) + " ";
                                    }
                                    else
                                    {
                                        query = " and title like @p" + (parameters.Count) + " ";
                                    }

                                    parameters.Add("%" + status.data.value + "%");
                                }

                                break;
                            }

                        case "desc-filter":
                            {
                                if (!String.IsNullOrEmpty(status.data.path) && !String.IsNullOrEmpty(status.data.value))
                                {
                                    if (prevQuery.IndexOf("where") == -1)
                                    {
                                        query = "where description like @p" + (parameters.Count) + " ";
                                    }
                                    else
                                    {
                                        query = " and description like @p" + (parameters.Count) + " ";
                                    }

                                    parameters.Add("%" + status.data.value + "%");
                                }

                                break;
                            }

                        case "themes":
                            {
                                if (status.data.pathGroup != null && status.data.pathGroup.Count > 0)
                                {
                                    filter = this.getCheckboxGroupFilterQuery("keyword1", status.data.pathGroup, parameters);

                                    if (!String.IsNullOrEmpty(filter))
                                    {
                                        if (prevQuery.IndexOf("where") == -1)
                                        {
                                            query = "where " + filter;
                                        }
                                        else
                                        {
                                            query = " and (" + filter + ")";
                                        }
                                    }
                                }

                                break;
                            }

                        case "colors":
                            {
                                if (status.data.pathGroup != null && status.data.pathGroup.Count > 0)
                                {
                                    filter = this.getCheckboxGroupFilterQuery("keyword2", status.data.pathGroup, parameters);

                                    if (!String.IsNullOrEmpty(filter))
                                    {
                                        if (prevQuery.IndexOf("where") == -1)
                                        {
                                            query = "where " + filter;
                                        }
                                        else
                                        {
                                            query = " and (" + filter + ")";
                                        }
                                    }
                                }

                                break;
                            }
                    }
                }
            }
            catch (Exception ex)
            {
                 Logger.Error("getFilterQuery: " + ex.Message + " " + ex.StackTrace);
            }

            return query;
        }

        #endregion
    }
}
