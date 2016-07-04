<!DOCTYPE html>
<html class="no-js">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>jPList Bootstrap Pagination Exclude Localstorage PHP MySQL | jPList - jQuery Data Grid Controls</title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- font libs -->
    <link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
    <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" />

    <!-- bootstrap -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />

    <!-- demo pages styles -->
    <link rel="stylesheet" href="../../dist/css/jplist.bootstrap-demo.min.css" />
    <style>
        .jplist-pagination-info{
            margin: 15px 15px 0 40px;
        }

        .jplist-items-per-page{
            margin: 15px 10px 0 0;
        }

        .jplist-pagination{
            margin: 10px 10px 15px 30px;
        }

        .center-block{
            width: 415px;
            margin: 20px auto;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
    </style>

</head>
<body>

<!-- top line -->
<div class="navbar navbar-inverse" id="top-line">
    <div class="container">

        <div class="row">

            <div class="col-md-6">
                <a class="navbar-brand" title="" href="https://github.com/no81no/jplist/issues?state=open">
                    <i class="fa fa-asterisk"></i> Request a feature / <i class="fa fa-bug"></i> Report a bug
                </a>
            </div>

            <!-- social menu -->
            <div class="col-md-6">
                <ul class="nav nav-pills pull-right hidden-xs">
                    <li><a title="" href="https://www.facebook.com/jplist"><i class="fa fa-facebook"></i>&nbsp;</a></li>
                    <li><a rel="publisher" title="" href="https://plus.google.com/+Jplistjs"><i class="fa fa-google-plus"></i></a></li>
                    <li><a title="" href="https://twitter.com/jquery_jplist"><i class="fa fa-twitter"></i></a></li>
                    <li><a title="" href="https://github.com/no81no/jplist"><i class="fa fa-github"></i></a></li>
                </ul>
            </div>

        </div>

    </div>
</div>

<!-- logo -->
<div id="logo">
    <div class="container text-center">
        <img title="jPList - jQuery Data Grid Controls" alt="jPList - jQuery Data Grid Controls" src="http://jplist.com/content/img/common/rocket.png" />
        <a title="" href="http://jplist.com">jPList - jQuery Data Grid Controls</a>
    </div>
</div>

<!-- main content -->
<div class="page" id="demo">

    <!-- header -->
    <div class="container">
        <div class="row">


            <div class="col-md-12">
                <h1 class="text-center">jPList Bootstrap Pagination Exclude Localstorage PHP MySQL</h1>
            </div>

        </div>
    </div>

    <!--<><><><><><><><><><><><><><><><><><><><><><><><><><> DEMO START <><><><><><><><><><><><><><><><><><><><><><><><><><>-->


    <!-- jplist top panel -->
    <div class="container jplist-panel">
        <div class="center-block">
            <div class="row">

                <div class="col-md-12">
                    <!-- pagination info label -->
                    <div
                            class="pull-left jplist-pagination-info"
                            data-type="<strong>Page {current} of {pages}</strong><br/> <small>{start} - {end} of {all}</small>"
                            data-control-type="pagination-info"
                            data-control-name="paging"
                            data-control-action="paging"></div>

                    <!-- items per page dropdown -->
                    <div
                            class="dropdown pull-left jplist-items-per-page"
                            data-control-type="boot-items-per-page-dropdown"
                            data-control-name="paging"
                            data-control-action="paging">

                        <button
                                class="btn btn-primary dropdown-toggle"
                                type="button"
                                data-toggle="dropdown"
                                id="dropdown-menu-1"
                                aria-expanded="true">
                            <span data-type="selected-text">Items per Page</span>
                            <span class="caret"></span>
                        </button>

                        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdown-menu-1">

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="3">3 per page</a>
                            </li>

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="5" data-default="true">5 per page</a>
                            </li>

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="10">10 per page</a>
                            </li>

                            <li role="presentation" class="divider"></li>

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="all">View All</a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div class="row">
                <div class="col-md-12">

                    <!-- bootstrap pagination control -->
                    <ul
                            class="pagination pull-left jplist-pagination"
                            data-control-type="boot-pagination"
                            data-control-name="paging"
                            data-control-action="paging"
                            data-control-storage="false"
                            data-range="7"
                            data-mode="google-like">
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- ajax content here -->
    <div class="list"></div>

    <!-- jplist bottom panel -->
    <div class="container jplist-panel">
        <div class="center-block">
            <div class="row">

                <div class="col-md-12">
                    <!-- pagination info label -->
                    <div
                            class="pull-left jplist-pagination-info"
                            data-type="<strong>Page {current} of {pages}</strong><br/> <small>{start} - {end} of {all}</small>"
                            data-control-type="pagination-info"
                            data-control-name="paging"
                            data-control-action="paging"></div>

                    <!-- items per page dropdown -->
                    <div
                            class="dropdown pull-left jplist-items-per-page"
                            data-control-type="boot-items-per-page-dropdown"
                            data-control-name="paging"
                            data-control-action="paging">

                        <button
                                class="btn btn-primary dropdown-toggle"
                                type="button"
                                data-toggle="dropdown"
                                id="dropdown-menu-2"
                                aria-expanded="true">
                            <span data-type="selected-text">Items per Page</span>
                            <span class="caret"></span>
                        </button>

                        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdown-menu-2">

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="3">3 per page</a>
                            </li>

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="5" data-default="true">5 per page</a>
                            </li>

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="10">10 per page</a>
                            </li>

                            <li role="presentation" class="divider"></li>

                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#" data-number="all">View All</a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div class="row">
                <div class="col-md-12">

                    <!-- bootstrap pagination control -->
                    <ul
                            class="pagination pull-left jplist-pagination"
                            data-control-type="boot-pagination"
                            data-control-name="paging"
                            data-control-action="paging"
                            data-control-storage="false"
                            data-range="7"
                            data-mode="google-like">
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!--<><><><><><><><><><><><><><><><><><><><><><><><><><> DEMO END <><><><><><><><><><><><><><><><><><><><><><><><><><>-->

</div>

<!-- footer -->
<footer class="navbar navbar-inverse" id="footer">
    <div class="container text-center">
        <a href="http://jplist.com" title="">Copyright &copy; <script>document.write(new Date().getFullYear())</script> <b>jPList Software</b></a>
    </div>
</footer>

<!-- jQuery lib -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<!-- Bootstrap lib -->
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

<!-- jPList lib -->
<script src="../../dist/js/jplist.core-ajax.min.js"></script>

<!-- jPList bootstrap filter dropdown control js -->
<script src="../../dist/js/jplist.bootstrap-pagination-bundle.min.js"></script>
    
<!-- Handlebars Templates Library: //handlebarsjs.com -->
<script src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.min.js"></script>

<!-- jPList start -->
<!-- jPList start -->
        <script>
            $('document').ready(function () {

                var $list = $('#demo .list')
                        , template = Handlebars.compile($('#jplist-template').html());

                //init jplist with php + mysql data source, json and handlebars template
                $('#demo').jplist({

                    itemsBox: '.list'
                    , itemPath: '.list-item'
                    , panelPath: '.jplist-panel'

                    , storage: 'localstorage'
                    , storageName: 'tests-bootstrap-pagination-exclude-storage-php'

                    //data source
                    , dataSource: {

                        type: 'server'
                        , server: {

                            //ajax settings
                            ajax: {
                                url: '../../server/server-json.php'
                                , dataType: 'json'
                                , type: 'POST'
                            }
                        }

                        //render function for json + templates like handlebars, xml + xslt etc.
                        , render: function (dataItem, statuses) {
                            $list.html(template(dataItem.content));
                        }
                    }

                });
            });
        </script>

        <!-- handlebars template -->
        <script id="jplist-template" type="text/x-handlebars-template">
            {{#each this}}

            <div class="list-item">
                <div class="container">
                    <div class="row">
                        <div class="col-md-2 text-center">
                            <img src="../../demo/icons/{{image}}" alt="" title=""/>
                        </div>
                        <div class="col-md-10">
                            <!--p class="date">{{date}}</p-->
                            <p class="title">{{title}}</p>
                            <p class="desc">{{description}}</p>
                            <p class="theme">{{keyword1}}, {{keyword2}}</p>
                            <p class="like">{{likes}} Likes</p>
                        </div>
                    </div>
                </div>
            </div>

            {{/each}}
        </script>
</body>
</html>