using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JPList.Domain.Models
{
    /// <summary>
    /// additional status data transfer object
    /// </summary>
    public class StatusDataDTO
    {
        #region "Common"

        /// <summary>
        /// jquery path or "default"
        /// </summary>
        public string path { get; set; }

        /// <summary>
        /// ignore regex
        /// </summary>
        public string ignore { get; set; }

        #endregion

        #region "Filtering"

        /// <summary>
        /// filter value
        /// </summary>
        public string value { get; set; }

        /// <summary>
        /// filter type: TextFilter, pathGroup, ..
        /// </summary>
        public string filterType { get; set; }

        /// <summary>
        /// list of jquery paths
        /// </summary>
        public List<string> pathGroup { get; set; }

        #endregion

        #region "Sorting"

        /// <summary>
        /// date time format
        /// </summary>
        public string dateTimeFormat { get; set; }

        /// <summary>
        /// sort order: asc/desc
        /// </summary>
        public string order { get; set; }

        #endregion

        #region "Pagination"

        /// <summary>
        /// items number
        /// </summary>
        public int number { get; set; }

        /// <summary>
        /// the current page index
        /// </summary>
        public int currentPage { get; set; }

        #endregion

    }
}
