require(['event'], function(Event){
    describe("A Backbone model representing the entire event", function() {
        it("should have a property called total that is the same as the length of the array of invitees", function() {
            expect(new Event({
                invitees:[{}, {}, {}]
            }).get('total')).toBe(3);
        });
    });
});
