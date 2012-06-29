define(

['backbone'],
function(Backbone){

var PieChartView = Backbone.View.extend({
    tagName: 'canvas',
    className: 'piechart',

    colour: function(){
        // Determine the colour of the pie chart
        // based on how full it is
        var n = this.ratio,
            r = Math.round(255 * (1 - n)),
            g = Math.round(255 * n),
            b = 0;
        var colour = 'rgb(' + r + ',' + g + ',' + b + ')';
        return colour;
    },

    draw: function(ratio){
        var ctx = this.context;
        var size = this.size;
        var half = this.half;

        // Clear the old image
        ctx.clearRect(0, 0, size, size);

        ctx.fillStyle = this.colour();
        ctx.beginPath();

        // Start at the center
        ctx.moveTo(half, half);

        // Draw a line to the top
        ctx.lineTo(half, 0);

        // Draw an arc clockwise round from north
        var offset = (Math.PI / 2);
        var start = -offset;
        var end = (Math.PI * 2 * ratio) - offset;
        ctx.arc(half, half, half, start, end, false);

        // Connect the arc back to the center, fill the shape in
        ctx.fill();
    },

    animate: function(){
        var that = this; // Save reference to keep access to draw function
        var duration = 0.6; // seconds
        var fps = 30;
        var frames = fps * duration;
        var step = duration / frames;

        var drawRatio = this.oldRatio; // Ratio to be drawn on each frame
        var endRatio = this.ratio; //Ratio to reach

        var direction = endRatio > drawRatio ? 1 : -1; // Is it increasing or decreasing?
        step *= direction;

        // Run the animation
        var timer = setInterval(function(){
            drawRatio += step;
            if(direction * drawRatio > direction * endRatio){
                clearInterval(timer);
            }
            that.draw(drawRatio);
        }, duration * 1000 / frames);
    },

    render: function(manage) {
        return manage(this).render().then(function(){
            this.el.height = this.size;
            this.el.width = this.size;

            // Cache a reference to the drawing context
            this.context = this.el.getContext('2d');
            if(this.ratio){
                this.animate();
            }
        });
    },

    initialize: function(ratio, oldRatio){
        this.ratio = ratio;
        this.oldRatio = oldRatio;
        this.size = 30;
        this.half = this.size / 2;
    }
});

return PieChartView;

});
