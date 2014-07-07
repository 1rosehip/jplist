<!DOCTYPE html>
<html lang="en">
	<head>
		<title><g:layoutTitle default="jPList - jQuery Data Grid Controls"/></title>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />		
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		
		<link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
		<link href="http://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.css" rel="stylesheet" />
		
		<link rel="shortcut icon" href="${assetPath(src: 'favicon.png')}" type="image/x-icon" />
		
  		<asset:stylesheet src="vendor/normalize.css"/>
		<asset:stylesheet src="styles.min.css"/>
				
		<asset:javascript src="vendor/jquery-1.10.0.min.js"/>
		<asset:javascript src="vendor/modernizr.min.js"/>
		
		<g:layoutHead/>
	</head>
	<body>
	
		<!-- black top bar -->
		<div class="box" id="black-top-bar">
			<div class="center">			
                <div class="box">

                    <!-- left menu -->
                    <ul class="hmenu left iphone-hidden" id="black-top-bar-left-menu">
                        <li><a href="https://github.com/no81no/jplist/issues?state=open" title=""><i class="fa fa-asterisk"></i> Request a feature / <i class="fa fa-bug"></i> Report a bug</a></li>
                    </ul>

                    <!-- social menu -->
					<ul class="hmenu right" id="social-menu">
						<li>
							<a href="https://www.facebook.com/jplist" title=""><i class="fa fa-facebook"></i>&nbsp;</a>
						</li>
						<li>
							<a href="https://plus.google.com/+Jplistjs" title="" rel="publisher"><i class="fa fa-google-plus"></i></a>
						</li>	
                        <li>
							<a href="https://twitter.com/jquery_jplist" title=""><i class="fa fa-twitter"></i></a>
						</li>					
						<li>
							<a href="https://github.com/no81no/jplist" title=""><i class="fa fa-github"></i></a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
		<!-- header -->
		<header class="box" id="header">
			<div class="box" id="header-box">
				<div class="center">			
					<div class="box">

						<!-- logo -->
						<div id="logo" class="left">	
							<asset:image src="common/rocket.png" alt="jPList - jQuery Data Grid Controls"/>
							<a href="/" title="">jPList - jQuery Data Grid Controls</a>
						</div>	
						
						<!-- main navigation -->
						<ul class="default-menu hmenu right" id="top-menu">
							<li><a title="" href="mailto:no81no@gmail.com"><i class="fa fa-envelope"></i> Contacts</a></li>			
                            <li><a title="" href="mailto:no81no@gmail.com" class="orange"><i class="fa fa-coffee"></i> Freelance</a></li>
						</ul>

					</div>
				</div>					
			</div>
		</header>
		
		<!-- bread crumbs-->
		<div id="bread-crumbs-box" class="box">
			<div id="bread-crumbs" class="box">
			
				<div class="center">
					<div class="box text-shadow">
						<p>
							 
						</p>
					</div>
				</div>
			</div>
		</div>
		
		<!-- main content -->
		<div class="box">
			<div class="center">
				<div class="box">

					<!-- tabs navigation -->
					<ul class="default-menu hmenu box">							
						
						<li>
							<a title="" href="http://jplist.com"><i class="fa fa-home"></i> Project Home <i class="fa fa-external-link"></i></a>
						</li>						
						<li>
							<a title="" href="http://jplist.com/home/download" class="orange"><i class="fa fa-download"></i> Download <i class="fa fa-external-link"></i></a>
						</li>
					
					</ul>
				</div>
			</div>
		</div>
		
		<g:layoutBody/>
		
		<!-- footer -->
		<footer class="box" id="footer">
			<div class="center">	
            		
                <!-- footer top row -->
                <div class="box footer-top-row">
				
                    <div class="left box-30">
                        <ul class="vmenu-2">
                            <li class="header">Support/Help</li>
                            <li><a href="https://github.com/no81no/jplist/issues?state=open" title=""><i class="fa fa-asterisk"></i> Request a feature</a></li>
                            <li><a href="https://github.com/no81no/jplist/issues?state=open" title=""><i class="fa fa-bug"></i> Report a bug</a></li>
                            <li><a href="https://github.com/no81no/jplist" title=""><i class="fa fa-github"></i> Download on GitHub</a></li>
                            <li><a href="http://www.binpress.com/app/jplist-jquery-data-grid-controls/2085?ad=34027"><i class="fa fa-shopping-cart"></i> Get commercial license</a></li>
                            <li><a href="mailto:no81no@gmail.com" title=""><i class="fa fa-envelope"></i> Contact us</a></li>
                        </ul>
                    </div>

                    <div class="left box-30">
                        <ul class="vmenu-2">
                            <li class="header">Follow jPList</li>
                            <!--li><a href="" title="">Follow us on Twitter</a></li-->
                            <li><a href="https://www.facebook.com/jplist" title=""><i class="fa fa-facebook"></i>&nbsp;&nbsp; Be a fan on Facebook</a></li>
                            <li><a href="https://plus.google.com/+Jplistjs" title=""><i class="fa fa-google-plus"></i> Follow us on Google+</a></li>
                            <li><iframe 
                                    allowtransparency="allowtransparency" 
                                    frameborder="0" 
                                    height="20" 
                                    style="margin-top: 10px;"
                                    scrolling="0" src="http://ghbtns.com/github-btn.html?user=no81no&amp;repo=jplist&amp;type=watch&amp;count=true" 
                                    width="102">
                                </iframe>
                            </li>
                        </ul>
                    </div>

                    <div class="right box-30 binpress-banner">
                        <a href="http://www.binpress.com?u=34027" title="Binpress - Frameworks, libraries, SDKs and Open-Source projects">
                            <img src="http://cdn.binpress.com/binpress-1-dark.png" alt="Binpress - Cut your development time and costs in half" width="280" height="58" style="border:none;" />
                        </a>                        
                    </div>
                </div>
			</div>

            <!-- footer bottom row -->
            <div class="box footer-bot-row">
                <div class="center">	
                    
                    <div class="box">
					    <p class="align-center" id="footer-content">
						    Copyright &copy;  <a href="mailto:no81no@gmail.com" title="">Miriam Zusin.</a>
					    </p>					
				    </div>

                </div>
            </div>
		</footer>
		
	</body>
</html>
