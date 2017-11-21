# Tables in Database

### Users
``` sql
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `userType` tinyint(1) DEFAULT '0' COMMENT '0 -normal user 1-admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

```

### Blogs

``` sql
CREATE TABLE `blogs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `postTitle` varchar(200) DEFAULT NULL,
  `createdBy` int(11) unsigned NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `blogs_ibfk_1` 
  FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) 
  ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

```

### Comments
``` sql
CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `comments` varchar(250) DEFAULT NULL,
  `commentedBy` int(11) unsigned NOT NULL,
  `commentedOn` int(11) unsigned NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `commentedBy` (`commentedBy`),
  KEY `commentedOn` (`commentedOn`),
  CONSTRAINT `comments_ibfk_1` 
  FOREIGN KEY (`commentedBy`) REFERENCES `users` (`id`) 
  ON UPDATE CASCADE ON DELETE CASCADE ,
  CONSTRAINT `comments_ibfk_2` 
  FOREIGN KEY (`commentedOn`) REFERENCES `blogs` (`id`) 
  ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

```
