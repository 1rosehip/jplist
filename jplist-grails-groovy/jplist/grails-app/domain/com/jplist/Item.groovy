package com.jplist

class Item {

	String title
	String image
	String description
	String keyword1 
	String keyword2
	Integer likes
	
    static constraints = {
		title(blank: false)
		image(blank: true)
		description(blank: true)
		keyword1(blank: true)
		keyword2(blank: true)
    }
}
