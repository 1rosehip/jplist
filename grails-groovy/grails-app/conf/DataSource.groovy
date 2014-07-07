dataSource {
    pooled = true
    jmxExport = true
    driverClassName = "com.mysql.jdbc.Driver"
    username = "root"
    password = "root"
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
//    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory' // Hibernate 3
    cache.region.factory_class = 'org.hibernate.cache.ehcache.EhCacheRegionFactory' // Hibernate 4
    singleSession = true // configure OSIV singleSession mode
}

// environment specific settings
environments {
    development {
        dataSource {
            dbCreate = "create-drop" // one of 'create', 'create-drop', 'update', 'validate', ''
            url = "jdbc:mysql://localhost/jplist_grails?useUnicode=yes&characterEncoding=UTF-8&autoReconnect=true"
            username = "root"
            password = "root"
        }
    }
    test {
        dataSource {
            dbCreate = "update"
			url = "jdbc:mysql://localhost/jplist_grails_prod?useUnicode=yes&characterEncoding=UTF-8"
			username = "root"
			password = "root"
        }
    }
    production {
        dataSource {
            dbCreate = "update"
			url = "jdbc:mysql://localhost/jplist_grails_prod?useUnicode=yes&characterEncoding=UTF-8"
			username = "root"
			password = "root"
        }
    }
}
