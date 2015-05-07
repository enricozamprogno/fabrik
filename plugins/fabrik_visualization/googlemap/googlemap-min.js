/*! fabrik */
var FbGoogleMapViz=new Class({Implements:Options,options:{lat:0,lon:0,clustering:!1,maptypecontrol:!1,scrollwheel:!1,overviewcontrol:!1,scalecontrol:!1,center:"middle",ajax_refresh:!1,use_polygon:!1,polyline:[],polylinewidth:[],polylinecolour:[],polygonopacity:[],polygonfillcolour:[],refresh_rate:1e4,use_cookies:!0,use_groups:!1,overlays:[],overlay_urls:[],overlay_labels:[],overlay_events:[],zoom:1,zoomStyle:0,radius_fill_colors:[],streetView:!1,styles:[]},initialize:function(a,b){if(this.element_map=a,this.element=document.id(a),this.clusterMarkerCursor=0,this.clusterMarkers=[],this.markers=[],this.distanceWidgets=[],this.icons=[],this.setOptions(b),this.options.ajax_refresh&&(this.updater=new Request.JSON({url:"",data:{option:"com_fabrik",format:"raw",task:"ajax_getMarkers",view:"visualization",controller:"visualization.googlemap",visualizationid:this.options.id},onSuccess:function(a){this.clearIcons(),this.clearPolyLines(),this.options.icons=a,this.addIcons(),this.setPolyLines(),this.options.ajax_refresh_center&&this.center(),Fabrik.fireEvent("fabrik.viz.googlemap.ajax.refresh",[this])}.bind(this)}),this.timer=this.update.periodical(this.options.refresh_rate,this)),"undefined"!=typeof Slimbox?Slimbox.scanPage():"undefined"!=typeof Mediabox&&Mediabox.scanPage(),this.container=document.id(this.options.container),"null"!==typeOf(this.container)){var c=this.container.getElement("form[name=filter]"),d=this.container.getElement(".clearFilters");d&&d.addEvent("click",function(a){this.container.getElements(".fabrik_filter").each(function(a){a.value=""}),a.stop(),c.submit()}.bind(this));var e=this.container.getElements("input.fabrik_filter_submit");"null"!==typeOf(e)&&e.addEvent("click",function(a){var b=Fabrik.fireEvent("list.filter",[this]).eventResults;"null"!==typeOf(b)&&0!==b.length&&b.contains(!1)?a.stop():c.submit()})}Fabrik.loadGoogleMap(!0,function(){this.iniGMap()}.bind(this))},iniGMap:function(){switch(this.options.maptype){case"G_NORMAL_MAP":default:this.options.maptype=google.maps.MapTypeId.ROADMAP;break;case"G_SATELLITE_MAP":this.options.maptype=google.maps.MapTypeId.SATELLITE;break;case"G_HYBRID_MAP":this.options.maptype=google.maps.MapTypeId.HYBRID;break;case"TERRAIN":this.options.maptype=google.maps.MapTypeId.TERRAIN}if("null"!==typeOf(this.element_map)){var a={center:new google.maps.LatLng(this.options.lat,this.options.lon),zoom:this.options.zoomlevel.toInt(),mapTypeId:this.options.maptype,scaleControl:this.options.scalecontrol,mapTypeControl:this.options.maptypecontrol,overviewMapControl:this.options.overviewcontrol,scrollwheel:this.options.scrollwheel,zoomControl:this.options.zoom,streetViewControl:this.options.streetView,zoomControlOptions:{style:this.options.zoomStyle}};if(this.map=new google.maps.Map(document.id(this.element_map),a),this.map.setOptions({styles:this.options.styles}),this.infoWindow=new google.maps.InfoWindow({content:""}),this.bounds=new google.maps.LatLngBounds,this.addIcons(),this.addOverlays(),google.maps.event.addListener(this.map,"click",function(a){this.setCookies(a)}.bind(this)),google.maps.event.addListener(this.map,"moveend",function(a){this.setCookies(a)}.bind(this)),google.maps.event.addListener(this.map,"zoomend",function(a){this.setCookies(a)}.bind(this)),this.infoWindow=new google.maps.InfoWindow({content:""}),this.bounds=new google.maps.LatLngBounds,this.options.use_cookies){var b=Cookie.read("mymapzoom_"+this.options.id),c=Cookie.read("mymaplat_"+this.options.id),d=Cookie.read("mymaplng_"+this.options.id);c&&"0"!==c&&"0"!==b?(this.map.setCenter(new google.maps.LatLng(c.toFloat(),d.toFloat())),this.map.setZoom(b.toInt())):this.center()}else this.center();this.setPolyLines()}},setPolyLines:function(){this.polylines=[],this.polygons=[],this.options.polyline.each(function(a,b){var c=[];a.each(function(a){c.push(new google.maps.LatLng(a[0],a[1]))});var d=this.options.polylinewidth[b],e=this.options.polylinecolour[b],f=this.options.polygonopacity[b],g=this.options.polygonfillcolour[b];if(this.options.use_polygon){var h=new google.maps.Polygon({paths:c,strokeColor:e,strokeWeight:d,strokeOpacity:f,fillColor:g});h.setMap(this.map),this.polygons.push(h)}else{var i=new google.maps.Polyline({path:c,strokeColor:e,strokeWeight:d});i.setMap(this.map),this.polylines.push(i)}}.bind(this))},clearPolyLines:function(){this.polylines.each(function(a){a.setMap(null)}),this.polygons.each(function(a){a.setMap(null)})},setCookies:function(){this.options.use_cookies&&(Cookie.write("mymapzoom_"+this.options.id,this.map.getZoom(),{duration:7}),Cookie.write("mymaplat_"+this.options.id,this.map.getCenter().lat(),{duration:7}),Cookie.write("mymaplng_"+this.options.id,this.map.getCenter().lng(),{duration:7}))},update:function(){this.updater.send()},clearIcons:function(){this.markers.each(function(a){a.setMap(null)})},noData:function(){return 0===this.options.icons.length},addIcons:function(){if(this.markers=[],this.clusterMarkers=[],this.options.icons.each(function(a){this.bounds.extend(new google.maps.LatLng(a[0],a[1])),this.markers.push(this.addIcon(a[0],a[1],a[2],a[3],a[4],a[5],a.groupkey,a.title,a.radius,a.c))}.bind(this)),this.renderGroupedSideBar(),this.options.clustering){var a=[],b=[53,56,66,78,90],c=0;for(c=1;5>=c;++c)a.push({url:Fabrik.liveSite+"components/com_fabrik/libs/googlemaps/markerclustererplus/images/m"+c+".png",height:b[c-1],width:b[c-1]});var d=null;""!==this.options.icon_increment&&(d=parseInt(this.options.icon_increment,10),d>14&&(d=14));var e=60;""!==this.options.cluster_splits&&(e=this.options.cluster_splits.test("/,/")?60:parseInt(this.options.cluster_splits,10)),this.cluster=new MarkerClusterer(this.map,this.clusterMarkers,{splits:this.options.cluster_splits,icon_increment:this.options.icon_increment,maxZoom:d,gridSize:e,styles:a})}},center:function(){var a;switch(this.options.center){case"middle":a=this.noData()?new google.maps.LatLng(this.options.lat,this.options.lon):this.bounds.getCenter();break;case"userslocation":geo_position_js.init()?geo_position_js.getCurrentPosition(this.geoCenter.bind(this),this.geoCenterErr.bind(this),{enableHighAccuracy:!0}):(fconsole("Geo locaiton functionality not available"),a=this.bounds.getCenter());break;case"querystring":a=new google.maps.LatLng(this.options.lat,this.options.lon);break;default:if(this.noData())a=new google.maps.LatLng(this.options.lat,this.options.lon);else{var b=this.options.icons.getLast();a=b?new google.maps.LatLng(b[0],b[1]):this.bounds.getCenter()}}this.map.setCenter(a)},geoCenter:function(a){this.map.setCenter(new google.maps.LatLng(a.coords.latitude.toFixed(2),a.coords.longitude.toFixed(2)))},geoCenterErr:function(a){fconsole("geo location error="+a.message)},addIcon:function(a,b,c,d,e,f,g,h,i,j){var k=new google.maps.LatLng(a,b),l={position:k,map:this.map};""!==d&&(l.flat=!0,l.icon="http://"!==d.substr(0,7)&&"https://"!==d.substr(0,8)?Fabrik.liveSite+"media/com_fabrik/images/"+d:d),l.title=h;var m=new google.maps.Marker(l);return m.groupkey=g,google.maps.event.addListener(m,"click",function(){this.setCookies(),this.infoWindow.setContent(c),this.infoWindow.open(this.map,m),this.periodCounter=0,this.timer=this.slimboxFunc.periodical(1e3,this),Fabrik.tips.attach(".fabrikTip")}.bind(this)),this.options.clustering&&(this.clusterMarkers.push(m),this.clusterMarkerCursor++),this.options.show_radius&&this.addRadius(m,i,j),this.periodCounter++,m},addRadius:function(a,b,c){if(this.options.show_radius&&b>0){var d=new google.maps.Circle({map:this.map,radius:b,fillColor:this.options.radius_fill_colors[c]});d.bindTo("center",a,"position")}},slimboxFunc:function(){var a=$$("a").filter(function(a){return a.rel&&a.rel.test(/^lightbox/i)});(a.length>0||this.periodCounter>15)&&(clearInterval(this.timer),"undefined"!=typeof Slimbox?$$(a).slimbox({},null,function(a){return this===a||this.rel.length>8&&this.rel===a.rel}):"undefined"!=typeof Mediabox&&$$(a).mediabox({},null,function(a){return this===a||this.rel.length>8&&this.rel===a.rel})),this.periodCounter++},toggleOverlay:function(a){if(a.target.id.test(/overlay_chbox_(\d+)/)){var b=a.target.id.match(/overlay_chbox_(\d+)/)[1].toInt();this.options.overlays[b].setMap(a.target.checked?this.map:null)}},addOverlays:function(){this.options.use_overlays&&this.options.overlay_urls.each(function(a,b){this.options.overlays[b]=new google.maps.KmlLayer(a),this.options.overlays[b].setMap(this.map),this.options.overlay_events[b]=function(a){this.toggleOverlay(a)}.bind(this),"null"!==typeOf(document.id("overlay_chbox_"+b))&&document.id("overlay_chbox_"+b).addEvent("click",this.options.overlay_events[b])}.bind(this))},watchSidebar:function(){this.options.use_overlays&&$$(".fabrik_calendar_overlay_chbox").each(function(){}.bind(this))},renderGroupedSideBar:function(){var a,b,c="";if(this.options.use_groups&&(this.grouped={},b=document.id(this.options.container).getElement(".grouped_sidebar"),"null"!==typeOf(b)&&(b.empty(),this.options.icons.each(function(d){if("null"===typeOf(this.grouped[d.groupkey])){a=d.groupkey;var e=d.groupkey.replace(/[^0-9a-zA-Z_]/g,"");"null"!==typeOf(this.options.groupTemplates[d.listid])&&(c=this.options.groupTemplates[d.listid][e]);var f=new Element("div").set("html",c);f.getElement("a")&&(f=f.getElement("a")),a=f.get("html"),this.grouped[d.groupkey]=[];var g=d.listid+d.groupkey.replace(/[^0-9a-zA-Z_]/g,"");g+=" "+d.groupClass;var h=new Element("a",{events:{click:function(a){var b=a.target.className.replace("groupedLink","groupedContent");b=b.split(" ")[0],document.getElements(".groupedContent").hide(),document.getElements("."+b).show()}},href:"#","class":"groupedLink"+g}).set("html",a);h.store("data-groupkey",d.groupkey);var i=new Element("div",{"class":"groupedContainer"+g}).adopt(h);i.inject(b)}this.grouped[d.groupkey].push(d)}.bind(this)),!this.watchingSideBar))){b.addEvent("click:relay(a)",function(a,b){a.preventDefault(),this.toggleGrouped(b)}.bind(this));var d=this.container.getElements(".clear-grouped");"null"!==typeOf(d)&&d.addEvent("click",function(a){a.stop(),this.toggleGrouped(!1)}.bind(this)),this.watchingSideBar=!0}},toggleGrouped:function(a){this.infoWindow.close(),document.id(this.options.container).getElement(".grouped_sidebar").getElements("a").removeClass("active"),a&&(a.addClass("active"),this.toggledGroup=a.retrieve("data-groupkey")),this.markers.each(function(b){b.setVisible(b.groupkey===this.toggledGroup||a===!1?!0:!1),b.setAnimation(google.maps.Animation.BOUNCE);var c=function(){b.setAnimation(null)};c.delay(1500)}.bind(this))},addPlugins:function(a){this.plugins=a}});