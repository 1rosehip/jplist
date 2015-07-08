# ![jPList - jQuery Data Grid Controls](http://jplist.com/content/img/common/rocket-50.png) [jPList - jQuery Data Grid Controls](http://jplist.com)


**jPList** is a flexible jQuery plugin for sorting, pagination and filtering of any HTML structure (DIVs, UL/LI, tables, etc). Get started at [jplist.com](http://jplist.com)

[![GitHub version](https://badge.fury.io/gh/no81no%2Fjplist.svg)](http://badge.fury.io/gh/no81no%2Fjplist)

###Common Features
- Works with any content (tables, lists, div elements etc...)
- Works with JavaScript templates like Handlebars, Mustache etc.
- Supports XML + XSLT
- Grid/list view demo page
- Supports local storage and cookies
- Has deep links support
- Fully customizable styles
- Works in all major browsers
- Annotated source code
- Solid documentation

### Data Sources
- [PHP + MySQL] (https://github.com/no81no/jplist-php-mysql)
- [ASP.NET + Sql Server](https://github.com/no81no/jplist-asp-net)
- [WordPress plugin](https://github.com/no81no/jplist-github-wordpress-plugin)
- [Groovy, Grails and MySQL](https://github.com/no81no/jplist-grails-groovy)
- [NodeJS, Express and MySQL](https://github.com/no81no/jplist-nodejs-express)
- [PHP + SQLite] (https://github.com/no81no/jplist/tree/master/jplist-data-sources/php-sqlite)

### Sorting
- Ascending and descending sorting
- Sort numbers, text, date and time
- SELECT and UL/LI sort controls
- Sort by 'Most Reviewed' and by 'Top Rated' items

###Pagination
- Auto pagination control
- Google style pagination
- Items per page control

###Filter and Search
- Any number of textbox filters
- Any number of dropdown filters
- Filter by jQuery path or by text content
- Checkbox and radio button filters
- Button filter controls
- Range filter controls

###Other Controls
- Reset button Control
- Back button Control
- Counter Controls
- jQuery UI range slider filter
- jQuery UI date picker range filter

## NodeJS

Sample project with **NodeJS**, **Express** and **MySQL** database can fe found [here](https://github.com/no81no/jplist/tree/master/nodejs-express). The data is in JSON format, and it's rendered on the client by Handlebars templates. Any other javascript template library can be used instead of Handlebars, for example Mustache templates, Underscore templates etc. 

[NPM package](https://www.npmjs.org/package/jplist)

```
npm install jplist
```

##Examples

###Layout Examples
- [DIVs Layout Demo](https://jplist.com/layoutexamples/div-layout) - demo with DIV elements and all default actions like sort, pagination, etc.
- [Table Demo 1](https://jplist.com/layoutexamples/table-1) - demo with all default actions like sort, pagination, etc. in TABLE
- [Table Demo 2](http://jplist.com/layoutexamples/table-2) - table with header and alternating rows with different colors
- [2 Tables on the Page](https://jplist.com/layoutexamples/two-tables) - demo with 2 tables on the page and all default actions like sort, pagination, etc.
- [UL LI Demo](https://jplist.com/layoutexamples/ul-li) - unordered list demo with all default actions like sort, pagination, etc. Added views control.
- [Views Control (List, Grid and Thumbs Views)](https://jplist.com/layoutexamples/list-grid) - demo with control that switches between views: list, grid or thumbs
- [Demo With Sticky Panel](https://jplist.com/layoutexamples/sticky-panel) - demo with sticky panel

### CMS
- [WordPress Plugin](https://jplist.com/home/jplist-wordpress-version)

### Data Sources
- [PHP + MySQL Example](https://jplist.com/datasourcesexamples/php-mysql-demo) - server side demo using PHP and MySQL database
- [PHP + MySQL + JSON + Handlebars Example](https://jplist.com/datasourcesexamples/php-mysql-json-handlebars-demo) - server side demo using PHP, MySQL database with JSON format and Handlebars Template
- [PHP + MySQL + JSON + Mustache Example](https://jplist.com/datasourcesexamples/php-mysql-json-mustache-demo) - server side demo using PHP, MySQL database with JSON format and Mustache Template
- [PHP + MySQL + XML + XSLT Example](https://jplist.com/datasourcesexamples/php-mysql-xml-xslt-demo) - server side demo using PHP, MySQL database with XML format and XSLT Template				
- [ASP.NET and SQL Server Demo](https://jplist.com/datasourcesexamples/asp-net-sql-server-demo) - server side demo using ASP.NET and SQL Server database
- [PHP + SQLite Example](https://jplist.com/datasourcesexamples/php-sqlite-demo) - server side demo using PHP and SQLite database

###Controls Examples
- [Dropdown Filters With UL/LI](https://jplist.com/controlsexamples/drop-down-filters-ul-li) - filter by jQuery path dropdown with UL/LI layout
- [Dropdown Filters With SELECT](https://jplist.com/controlsexamples/drop-down-filters-select) - filter by jQuery path dropdown with SELECT layout
- [Double Sort Demo](https://jplist.com/controlsexamples/double-sort) - example with double sorting
- [Deep Linking Demo](https://jplist.com/otherexamples/deep-linking) - page state controlled by URL
- [Google Style Pagination](https://jplist.com/controlsexamples/google-style-pagination)
- [Star Rating Demo](https://jplist.com/controlsexamples/star-rating) - sort by 'Most Reviewed' and by 'Top Rated' items
- [Hidden Sort (Default Sort Control)](https://jplist.com/controlsexamples/hidden-sort)

###Toggle Filters
- [Checkbox Filters](https://jplist.com/togglefiltersexamples/checkbox-filters) - filter by jQuery path using group of checkboxes. OR logic inside group, AND logic between different groups
- [Radio Button Filters](https://jplist.com/togglefiltersexamples/radio-buttons-filters) - filter by jQuery path with radio buttons
- [Button Filters](https://jplist.com/togglefiltersexamples/button-filters-input) - filter by jQuery path with BUTTON elements
- [Button Filters Group](https://jplist.com/togglefiltersexamples/button-filters-span-group) - filter by jQuery path using group of elements like SPAN, INPUT, etc. OR logic inside group, AND logic between different groups
- [Button Filters Group (Single Mode)](https://jplist.com/togglefiltersexamples/button-filters-span-group-single-mode) - button filters group when only one button can be selected at the same time
- [Button Filters and Counters](https://jplist.com/togglefiltersexamples/button-filters-span-group) - filter by jQuery path with SPAN elements and counter controls
- [Range Filter](https://jplist.com/togglefiltersexamples/range-filter) - range filter by jQuery path with any element (SPAN, INPUT, etc.)
- [Checkbox Text Filter](https://jplist.com/togglefiltersexamples/checkbox-text-filter) - filter by checkboxes text values. OR logic inside group, AND logic between different groups
- [Button Text Filter](https://jplist.com/togglefiltersexamples/button-text-filter) - filter by text using any elements like SPAN, INPUT etc.
- [Button Text Filter Group](https://jplist.com/togglefiltersexamples/button-text-filter-group) - filter by text using any elements like SPAN, INPUT etc. OR logic inside group, AND logic between different groups

###jPList with jQuery UI
- [Range Slider](https://jplist.com/jqueryuiexamples/range-slider) - jQuery UI range slider
- [Date Picker Filter](https://jplist.com/jqueryuiexamples/date-picker-range-filter) - jQuery UI date picker

###DateTime Examples
- [DateTime 1](https://jplist.com/datetimeexamples/datetime-1) - {day}.{month}.{year}
- [DateTime 2](https://jplist.com/datetimeexamples/datetime-2) - {month} {day}, {year} {hour}:{min}:{sec}
- [DateTime 3](https://jplist.com/datetimeexamples/datetime-3) - {month} {day}, {year}

###Other Examples
- [Fade Animation](https://jplist.com/otherexamples/fade-animation) - example page of fade animation in jPList
- [jPList with Fancybox](https://jplist.com/otherexamples/jplist-with-fancybox) - example of jPList with lightbox
- [Large Amount of Data](https://jplist.com/otherexamples/large-amount-of-data-demo) - demo with 1000 items on the page

###Browser Compatibility
- Internet Explorer 8+
- Firefox
- Chrome
- Safari
- Opera

###jQuery Compatibility
- Works with jQuery from [version 1.7](http://code.jquery.com/jquery-1.7.min.js)
- Works with jQuery 2.x versions

##Links
- [Project Home](https://jplist.com)
- [jPList on Facebook](https://www.facebook.com/jplist)
- [jPList on Google+](https://plus.google.com/+Jplistjs)
- [jPList on Twitter+](https://twitter.com/jquery_jplist)