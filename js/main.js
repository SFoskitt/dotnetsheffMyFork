
var dotnetsheff = {
	constants: {},
	viewModels: {}
};

dotnetsheff.constants = {
	meetupApiKey: "18486437f4e51d665652559152c44",
	groupId: 13372672
};

dotnetsheff.viewModels.EventSummaryViewModel = function(title, time, description, eventUrl) {
	var self = this;
	
	self.title = ko.observable(title);
	self.time = ko.observable(time);
	self.description = ko.observable(description);
	self.eventUrl = ko.observable(eventUrl);
};

dotnetsheff.viewModels.CountDownViewModel = function(miliseconds) {
	var self = this;
	
	self.totalSecsLeft = ko.observable(miliseconds / 1000);
	
	self.isVisible = ko.computed(function() {
		return this.totalSecsLeft() > 0;
	}, self);
	
	var tickDown = function(){
		self.totalSecsLeft(self.totalSecsLeft() - 1);
		
		if(self.totalSecsLeft() > 0) {
			setTimeout(tickDown, 1000);
		}
	};
	
	self.offset = ko.computed(function() {
		return {
                seconds: Math.floor(this.totalSecsLeft() % 60),
                minutes: Math.floor(this.totalSecsLeft() / 60) % 60,
                hours: Math.floor(this.totalSecsLeft() / 60 / 60) % 24,
                days: Math.floor(this.totalSecsLeft() / 60 / 60 / 24) % 7,
                totalDays: Math.floor(this.totalSecsLeft() / 60 / 60 / 24),
                weeks: Math.floor(this.totalSecsLeft() / 60 / 60 / 24 / 7),
                months: Math.floor(this.totalSecsLeft() / 60 / 60 / 24 / 30),
                years: Math.floor(this.totalSecsLeft() / 60 / 60 / 24 / 365)
            };
	}, self);
	
	setTimeout(tickDown, 1000);

};

dotnetsheff.viewModels.HomeViewModel = function() {
	var self = this;
	self.nextEvent = ko.observable();
	self.previousEvents = ko.observableArray();
	
	self.countdown = ko.observable();
	
	self.countdownVisible = ko.computed(function() {
		return this.countdown() && this.countdown().isVisible();
	}, self);
	
	self.nextEvent.subscribe(function (newValue) {
		var miliseconds = moment(newValue.time()).diff(moment(new Date()));
		
		self.countdown(new dotnetsheff.viewModels.CountDownViewModel(miliseconds));
	});
		
	var fetchNextEvents = function(){
		$.ajax({
				type: "GET",
				url: "https://api.meetup.com/2/events",
				crossDomain: true,
				dataType: "jsonp",
				data: {
					group_id: 18649738,
					status: 'upcoming',
					key: dotnetsheff.constants.meetupApiKey,
					time: '0m,1m',
				}
			})
			.done(function(response) {
				var nextEvent = new dotnetsheff.viewModels.EventSummaryViewModel(response.results[0].name, response.results[0].time,response.results[0].description, response.results[0].event_url);
				
				self.nextEvent(nextEvent);
		});;
	};
	
	(function(){
		fetchNextEvents();
	})();
};

(function(){
	ko.applyBindings(new dotnetsheff.viewModels.HomeViewModel());
})();


// Map stuff...

var mapcanvas = document.getElementById('map-canvas');
if(mapcanvas){

	  function initialize() {
		var location = { lat: 53.373379, lng: -1.470429};
		var mapOptions = {
		zoom: 16,
		center: location,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scrollwheel: false
	};
	
	var map = new google.maps.Map(mapcanvas,
		mapOptions);
  
   var contentString = 'dotnetsheff';

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	var marker = new google.maps.Marker({
		position: location,
		map: map,
		title: "dotnetsheff"
	});

	google.maps.event.addListener(marker, "click", function() {
		infowindow.open(map, marker);
	});
  }
  google.maps.event.addDomListener(window, 'load', initialize);
  }
