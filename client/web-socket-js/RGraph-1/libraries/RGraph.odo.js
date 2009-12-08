    /**
    * o------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:             |
    * |                                                                              |
    * |                          http://www.rgraph.net                               |
    * |                                                                              |
    * | This package is licensed under the RGraph license. For all kinds of business |
    * | purposes there is a small one-time licensing fee to pay and for personal,    |
    * | charity and educational purposes it is free to use. You can read the full    |
    * | license here:                                                                |
    * |                      http://www.rgraph.net/LICENSE.txt                       |
    * o------------------------------------------------------------------------------o
    */
    
    if (typeof(RGraph) == 'undefined') RGraph = {};

    /**
    * The odometer constructor. Pass it the ID of the canvas tag, the start value of the odo,
    * the end value, and the value that the pointer should point to.
    * 
    * @param string id    The ID of the canvas tag
    * @param int    start The start value of the Odo
    * @param int    end   The end value of the odo
    * @param int    value The indicated value (what the needle points to)
    */
    RGraph.Odometer = function (id, start, end, value)
    {
        this.id      = id
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'odo';


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);


        this.properties = [];
        this.properties['chart.start']            = start;
        this.properties['chart.end']              = end;
        this.properties['chart.value']            = value;
        this.properties['chart.needle.style']     = 'black';
        this.properties['chart.needle.thickness'] = 2;
        this.properties['chart.needle.head']      = true;
        this.properties['chart.text.size']        = 10;
        this.properties['chart.text.color']        = 'black';
        this.properties['chart.text.font']        = 'Verdana';
        this.properties['chart.green.start']      = null;
        this.properties['chart.green.end']        = null;
        this.properties['chart.yellow.start']     = null;
        this.properties['chart.yellowend']        = null;
        this.properties['chart.red.start']        = null;
        this.properties['chart.red.end']          = null;
        this.properties['chart.label.area']       = 35;
        this.properties['chart.gutter']           = 25;
        this.properties['chart.title']            = '';
        this.properties['chart.title.vpos']       = null;
        this.properties['chart.contextmenu']      = null;
        this.properties['chart.linewidth']        = 1;
        this.properties['chart.shadow.inner']     = false;
        this.properties['chart.shadow.outer']     = false;
        this.properties['chart.annotatable']      = false;
        this.properties['chart.annotate.color']   = 'black';
        this.properties['chart.zoom.factor']      = 1.5;
        this.properties['chart.zoom.fade.in']     = true;
        this.properties['chart.zoom.fade.out']    = true;
        this.properties['chart.zoom.hdir']        = 'right';
        this.properties['chart.zoom.vdir']        = 'down';
        this.properties['chart.zoom.frames']      = 10;
        this.properties['chart.zoom.delay']       = 50;
        this.properties['chart.zoom.shadow']      = true;
        this.properties['chart.zoom.mode']             = 'canvas';
        this.properties['chart.zoom.thumbnail.width']  = 75;
        this.properties['chart.zoom.thumbnail.height'] = 75;
        
        // Check the common library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[ODO] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * A peudo setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.Odometer.prototype.Set = function (name, value)
    {
        this.properties[name.toLowerCase()] = value;
    }


    /**
    * A getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Odometer.prototype.Get = function (name)
    {
        return this.properties[name.toLowerCase()];
    }


    /**
    * Draws the odometer
    */
    RGraph.Odometer.prototype.Draw = function ()
    {
        // Work out a few things
        this.radius   = Math.min(this.canvas.width / 2, this.canvas.height / 2) - this.Get('chart.gutter');
        this.diameter = 2 * this.radius;
        this.centerx  = this.canvas.width / 2;
        this.centery  = this.canvas.height / 2;
        this.range    = this.Get('chart.end') - this.Get('chart.start');
        this.context.lineWidth = this.Get('chart.linewidth');

        // Draw the background
        this.DrawBackground();

        // And lastly, draw the labels
        this.DrawLabels();

        // Draw the needle
        this.DrawNeedle();
        
        
        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        RGraph.Annotate(this);
        
        /**
        * This bit shows the mini zoom window if requested
        */
        RGraph.ShowZoomWindow(this);
    }

    /**
    * Draws the background
    */
    RGraph.Odometer.prototype.DrawBackground = function ()
    {
        this.context.beginPath();

        /**
        * Turn on the shadow if need be
        */
        if (this.Get('chart.shadow.outer')) {
            this.context.shadowColor   = '#666';
            this.context.shadowBlur    = 6;
            this.context.shadowOffsetX = 3;
            this.context.shadowOffsetY = 3;
        }

        var backgroundColor = '#eee';

        // Draw the grey border
        this.context.fillStyle = backgroundColor;
        this.context.arc(this.centerx, this.centery, this.radius, 0.0001, 6.28, false);
        this.context.fill();

        /**
        * Turn on the shadow
        */
        this.context.shadowColor   = 'rgba(0,0,0,0)';
        this.context.shadowBlur    = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;


        // Draw a circle
        this.context.strokeStyle = '#666';
        this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, false);

        // Now draw a big white circle to make the lines appear as tick marks
        // This is solely for Chrome
        this.context.fillStyle = backgroundColor;
        this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, false);
        this.context.fill();

        // Draw the tick marks
        for (var i=0; i<=360; i+=9) {
            this.context.arc(this.centerx, this.centery, this.radius, 0, RGraph.degrees2Radians(i), false);
            this.context.lineTo(this.centerx, this.centery);
        }


        this.context.stroke();

        this.context.beginPath();
        
        // Now draw a big white circle to make the lines appear as tick marks
        this.context.fillStyle = backgroundColor;
        this.context.strokeStyle = backgroundColor;
        this.context.arc(this.centerx, this.centery, this.radius - 5, 0, 6.28, false);
        this.context.fill();
        this.context.stroke();

        /**
        * Now draw the center bits shadow if need be
        */
        if (this.Get('chart.shadow.inner')) {
            this.context.beginPath();
            this.context.shadowColor   = '#000';
            this.context.shadowBlur    = 6;
            this.context.shadowOffsetX = 3;
            this.context.shadowOffsetY = 3;
            this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.label.area'), 0, 6.28, 0);
            this.context.fill();
            this.context.stroke();
    
            /**
            * Turn on the shadow
            */
            this.context.shadowColor   = 'rgba(0,0,0,0)';
            this.context.shadowBlur    = 0;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
        }

        // Now draw the green area if they're defined
        if (this.Get('chart.green.start') != null && this.Get('chart.green.end') != null) {

            var greengrad = this.canvas.getContext('2d').createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, this.canvas.width / 2);
            greengrad.addColorStop(0, '#fff');
            greengrad.addColorStop(1, '#0f0');

            this.context.beginPath();
                this.context.fillStyle = greengrad;
                this.context.arc(
                                 this.centerx,
                                 this.centery,
                                 this.radius - this.Get('chart.label.area'),
                                 ( (this.Get('chart.green.start') / this.Get('chart.end')) * 6.28) - 1.57,
                                 ( (this.Get('chart.green.end') / this.Get('chart.end')) * 6.28) - 1.57,
                                 false
                                );
                this.context.lineTo(this.centerx, this.centery);
            this.context.closePath();

            this.context.stroke();
            this.context.fill();
        }
        
        // Now draw the yellow area if they're defined
        if (this.Get('chart.yellow.start') != null && this.Get('chart.yellow.end') != null) {

            var yellowgrad = this.canvas.getContext('2d').createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, this.canvas.width / 2);
            yellowgrad.addColorStop(0, '#fff');
            yellowgrad.addColorStop(1, '#ff0');

            this.context.beginPath();
                this.context.fillStyle = yellowgrad;
                this.context.strokeStyle = yellowgrad;
                this.context.arc(
                                 this.centerx,
                                 this.centery,
                                 this.radius - this.Get('chart.label.area'),
                                 ( (this.Get('chart.yellow.start') / this.Get('chart.end')) * 6.2830) - RGraph.degrees2Radians(90),
                                 ( (this.Get('chart.yellow.end') / this.Get('chart.end')) * 6.2830) - RGraph.degrees2Radians(90),
                                 false
                                );
                this.context.lineTo(this.centerx, this.centery);
            this.context.closePath();

            this.context.stroke();
            this.context.fill();

        }
        
        // Now draw the red area if they're defined
        if (this.Get('chart.red.start') != null && this.Get('chart.red.end') != null) {

            var redgrad = this.canvas.getContext('2d').createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, this.canvas.width / 2);
            redgrad.addColorStop(0, '#fff');
            redgrad.addColorStop(1, '#f00');

            this.context.beginPath();
                this.context.fillStyle = redgrad;
                this.context.strokeStyle = redgrad;
                this.context.arc(
                                 this.centerx,
                                 this.centery,
                                 this.radius - this.Get('chart.label.area'),
                                 ( (this.Get('chart.red.start') / this.Get('chart.end')) * 6.2830) - RGraph.degrees2Radians(90),
                                 ( (this.Get('chart.red.end') / this.Get('chart.end')) * 6.2830) - RGraph.degrees2Radians(90),
                                 false
                                );
                this.context.lineTo(this.centerx, this.centery);
            this.context.closePath();

            this.context.fill();
        }
            
        /**
        * Draw the title if specified
        */
        if (this.Get('chart.title')) {
            RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.Get('chart.gutter'), null, this.Get('chart.text.size') + 2);
        }
    }


    /**
    * Draws the needle of the odometer
    */
    RGraph.Odometer.prototype.DrawNeedle = function ()
    {
        this.context.fillStyle = '#666';
        this.context.strokeStyle = '#666';

        // Draw the centre bit
        this.context.beginPath();
            this.context.moveTo(this.centerx, this.centery);
            this.context.arc(this.centerx, this.centery, 10, 0, 6.28, false);
            this.context.fill();
        this.context.closePath();
        
        this.context.stroke();
        this.context.fill();

        this.context.strokeStyle = this.Get('chart.needle.style');
        this.context.lineWidth   = this.Get('chart.needle.thickness');
        this.context.lineCap     = 'round';
        this.context.lineJoin    = 'round';
        
        // Draw the needle
        this.context.beginPath();
            // The trailing bit on the opposite side of the dial
            RGraph.lineByAngle(this.context, this.centerx, this.centery, RGraph.degrees2Radians( ((this.Get('chart.value') / this.range) * 360) + 90), 20);

            // Draw the long bit on the opposite side
            RGraph.lineByAngle(this.context, this.centerx, this.centery, RGraph.degrees2Radians( ((this.Get('chart.value') / this.range) * 360) - 90), this.radius - 15 - this.Get('chart.gutter'));

            // Need something like ftell() to determine the current X/Y
        this.context.closePath();
        
        this.context.stroke();
        
        // This draws the arrow at the end of the line
        if (this.Get('chart.needle.head')) {
            this.context.fillStyle = this.Get('chart.needle.style');
    
            this.context.beginPath();
                RGraph.lineByAngle(this.context, this.centerx, this.centery, RGraph.degrees2Radians( ((this.Get('chart.value') / this.range) * 360) - 90), this.radius - this.Get('chart.label.area') - 5);
                this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.label.area') - 15, RGraph.degrees2Radians( ((this.Get('chart.value') / this.range) * 360) - 87), RGraph.degrees2Radians( ((this.Get('chart.value') / this.range) * 360) - 93), 1);
            this.context.closePath();
    
            this.context.fill();
            this.context.stroke();
        }
    }
    
    /**
    * Draws the labels for the Odo
    */
    RGraph.Odometer.prototype.DrawLabels = function ()
    {
        this.context.beginPath();
        this.context.fillStyle = this.Get('chart.text.font');
        
        var r = this.radius - (this.Get('chart.label.area') / 2);
        var font = this.Get('chart.text.font');

        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx + (0.588 * r ), this.centery - (0.809 * r ), String(this.Get('chart.end') * (1/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx + (0.951 * r ), this.centery - (0.309 * r), String(this.Get('chart.end') * (2/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx + (0.949 * r), this.centery + (0.287 * r), String(this.Get('chart.end') * (3/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx + (0.588 * r ), this.centery + (0.809 * r ), String(this.Get('chart.end') * (4/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx, this.centery + r, String(this.Get('chart.end') * (5/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx - (0.588 * r ), this.centery + (0.809 * r ), String(this.Get('chart.end') * (6/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx - (0.949 * r), this.centery + (0.300 * r), String(this.Get('chart.end') * (7/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx - (0.951 * r), this.centery - (0.309 * r), String(this.Get('chart.end') * (8/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx - (0.588 * r ), this.centery - (0.809 * r ), String(this.Get('chart.end') * (9/10)), 'center', 'center');
        RGraph.Text(this.context, font, this.Get('chart.text.size'), this.centerx, this.centery - r, String(this.Get('chart.end') * (10/10)), 'center', 'center');
        
        this.context.fill();
        this.context.stroke();
    }




