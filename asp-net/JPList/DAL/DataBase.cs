using System;
using System.Data;
using System.Data.Common;
using System.Text;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using JPList.Log;

using JPList.Domain.Models;

namespace JPList.DAL
{
    public class DataBase
    {
        private string FactoryName;
        private DbProviderFactory Factory;
        private string ConnectionString;

        public DataBase()
        {
            try
            {
                this.FactoryName = "System.Data.SqlClient";
                this.Factory = DbProviderFactories.GetFactory(this.FactoryName);
                this.ConnectionString = ConfigurationManager.ConnectionStrings["JplistConnection"].ConnectionString;
            }
            catch (Exception ex)
            {
                 Logger.Error("JPList DB Contructor: " + ex.Message + " " + ex.StackTrace);
            }
        }

        /// <summary>
        /// Get a number using sql query with list of unnamed parameters
        /// </summary>
        /// <param name="queryWithUnnamedParameters">sql query</param>
        /// <param name="parameters">unnamed parameters list</param>
        /// <returns>number</returns>
        public int GetNumber(string queryWithUnnamedParameters, List<string> parameters)
        {
            int number = 0;
            int counter = 0;
            DbParameter param;

            try
            {
                using (DbConnection Conn = this.Factory.CreateConnection())
                {
                    Conn.ConnectionString = this.ConnectionString;

                    //for every row in the table
                    using (DbCommand cmd = this.Factory.CreateCommand())
                    {
                        //set queary string
                        cmd.CommandText = queryWithUnnamedParameters;
                        cmd.Connection = Conn;
                        
                        foreach (string parameter in parameters)
                        {
                            param = cmd.CreateParameter();
                            param.ParameterName = "@p" + counter;
                            param.Value = parameter;
                            cmd.Parameters.Add(param);

                            counter++;
                        }                        
                        
                        Conn.Open();
                        number = Int32.Parse(cmd.ExecuteScalar().ToString());                                               
                        Conn.Close();
                    }
                }

            }
            catch (Exception ex)
            {
                Logger.Error("JPList DB GetNumber: " + ex.Message + " " + ex.StackTrace);
            }

            return number;
        }

        /// <summary>
        /// Execute non query using list of unnamed parameters
        /// </summary>
        /// <param name="queryWithUnnamedParameters">sql query</param>
        /// <param name="parameters">unnamed parameters list</param>
        /// <returns>the number of affected items</returns>
        public int ExecuteNonQuery(string queryWithUnnamedParameters, List<string> parameters)
        {
            int rowsAffectedNum = 0;
            int counter = 0;
            DbParameter param;

            try
            {
                using (DbConnection Conn = this.Factory.CreateConnection())
                {
                    Conn.ConnectionString = this.ConnectionString;

                    //for every row in the table
                    using (DbCommand cmd = this.Factory.CreateCommand())
                    {
                        //set queary string
                        cmd.CommandText = queryWithUnnamedParameters;
                        cmd.Connection = Conn;

                        foreach (string parameter in parameters)
                        {
                            param = cmd.CreateParameter();
                            param.ParameterName = "@p" + counter;
                            param.Value = parameter;
                            cmd.Parameters.Add(param);

                            counter++;
                        }

                        Conn.Open();
                        rowsAffectedNum = cmd.ExecuteNonQuery();
                        Conn.Close();
                    }
                }

            }
            catch (Exception ex)
            {
                 Logger.Error("JPList DB ExecuteNonQuery: " + ex.Message + " " + ex.StackTrace);
            }

            return rowsAffectedNum;
        }

        /// <summary>
        /// Perform select query using list of unnamed parameters
        /// </summary>
        /// <param name="queryWithUnnamedParameters">sql query</param>
        /// <param name="parameters">unnamed parameters list</param>
        /// <param name="callback">the callback</param>
        public List<Item> Select(string queryWithUnnamedParameters, List<string> parameters)
        {
            List<Item> items = new List<Item>();
            Item item;
            int counter = 0;
            DbParameter param;

            try
            {
                using (DbConnection Conn = this.Factory.CreateConnection())
                {
                    Conn.ConnectionString = this.ConnectionString;

                    //for every row in the table
                    using (DbCommand cmd = this.Factory.CreateCommand())
                    {
                        //set queary string
                        cmd.CommandText = queryWithUnnamedParameters;
                        cmd.Connection = Conn;

                        foreach (string parameter in parameters)
                        {
                            param = cmd.CreateParameter();
                            param.ParameterName = "@p" + counter;
                            param.Value = parameter;
                            cmd.Parameters.Add(param);

                            counter++;
                        }

                        Conn.Open();

                        using (DbDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                item = new Item();

                                item.Title = dr.GetString(dr.GetOrdinal("title"));
                                item.Description = dr.GetString(dr.GetOrdinal("Description"));
                                item.Image = dr.GetString(dr.GetOrdinal("Image"));
                                item.Keyword1 = dr.GetString(dr.GetOrdinal("Keyword1"));
                                item.Keyword2 = dr.GetString(dr.GetOrdinal("Keyword2"));
                                item.Likes = dr.GetInt32(dr.GetOrdinal("Likes"));

                                items.Add(item);
                            }
                        }
                        Conn.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                 Logger.Error("JPList DB Select: " + ex.Message + " " + ex.StackTrace);
            }

            return items;
        }

        /// <summary>
        /// create parameter
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="ParameterName"></param>
        /// <param name="ParameterType"></param>
        /// <param name="ParameterValue"></param>
        public void CreateParameter(DbCommand cmd, string ParameterName, DbType ParameterType, object ParameterValue)
        {
            DbParameter param = cmd.CreateParameter();

            try
            {
                param.ParameterName = ParameterName;
                param.DbType = ParameterType;
                param.Value = ParameterValue;
                cmd.Parameters.Add(param);
            }
            catch (Exception ex)
            {
                 Logger.Error("JPList DB CreateParameter: " + ex.Message + " " + ex.StackTrace);
            }
        }

    }
}
