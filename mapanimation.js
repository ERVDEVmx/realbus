const mapApp = {
    map: null,
    markers: [],
    apiUrl: 'https://api-v3.mbta.com/vehicles?[Add your key]',
    init: function() {
        const myOptions = {
            zoom: 14,
            center: { lat: 42.353350, lng: -71.091525 },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        const element = document.getElementById('map');
        this.map = new google.maps.Map(element, myOptions);
        this.addMarkers();
    },
    addMarkers: async function() {
        const locations = await this.getBusLocations();

        locations.forEach(bus => {
            const marker = this.getMarker(bus.id);
            marker ? this.moveMarker(marker, bus) : this.addMarker(bus);
        });

        console.log(new Date());
        setTimeout(() => this.addMarkers(), 15000);
    },
    getBusLocations: async function() {
        const response = await fetch(this.apiUrl);
        const json = await response.json();
        return json.data;
    },
    addMarker: function(bus) {
        const icon = this.getIcon(bus);
        const marker = new google.maps.Marker({
            position: {
                lat: bus.attributes.latitude,
                lng: bus.attributes.longitude
            },
            map: this.map,
            icon: icon,
            id: bus.id
        });
        this.markers.push(marker);
    },
    getIcon: function(bus) {
        return bus.attributes.direction_id === 0 ? 'red.png' : 'blue.png';
    },
    moveMarker: function(marker, bus) {
        marker.setIcon(this.getIcon(bus));
        marker.setPosition({
            lat: bus.attributes.latitude,
            lng: bus.attributes.longitude
        });
    },
    getMarker: function(id) {
        return this.markers.find(item => item.id === id);
    }
};

// Initialize the map with the following:
mapApp.init();
