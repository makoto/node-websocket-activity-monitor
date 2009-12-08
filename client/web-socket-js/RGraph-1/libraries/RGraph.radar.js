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
    * The pseudo radar chart constuctor
    * 
    * @param object canvas
    * @param array data
    */
    RGraph.Radar = function (id, data)
    {
        this.id         = id;
        this.canvas     = document.getElementById(id);
        this.context    = this.canvas.getContext('2d');
        this.data       = data;
        this.canvas.__object__ = this;
        this.type              = 'radar';


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);


        this.centerx = 0;
        this.centery = 0;
        this.radius  = 0;

        this.max     = 0;
        
        this.properties = [];
        this.properties['chart.colors']          = ['rgb(255,0,0)', 'rgb(0,255,255)',
                                                    'rgb(0,255,0)', 'rgb(127,127,127)',
                                                    'rgb(0,0,255)', 'rgb(255,128,255)'];
        this.properties['chart.gutter']          = 25;
        this.properties['chart.title']           = '';
        this.properties['chart.title.vpos']      = null;
        this.properties['chart.labels']          = [];
        this.properties['chart.key.background']  = '#fff';
        this.properties['chart.key.shadow']      = false;
        this.properties['chart.text.color']      = 'black';
        this.properties['chart.text.font']       = 'Verdana';
        this.properties['chart.text.size']       = 10;
        this.properties['chart.key.position']    = 'graph';
        this.properties['chart.contextmenu']     = null;
        this.properties['chart.tooltips']        = [];
        this.properties['chart.tooltip.effect']  = 'fade';
        this.properties['chart.annotatable']     = false;
        this.properties['chart.annotate.color']  = 'black';
        this.properties['chart.zoom.factor']     = 1.5;
        this.properties['chart.zoom.fade.in']    = true;
        this.properties['chart.zoom.fade.out']   = true;
        this.properties['chart.zoom.hdir']       = 'right';
        this.properties['chart.zoom.vdir']       = 'down';
        this.properties['chart.zoom.frames']     = 10;
        this.properties['chart.zoom.delay']      = 50;
        this.properties['chart.zoom.shadow']     = true;
        this.properties['chart.zoom.mode']             = 'canvas';
        this.properties['chart.zoom.thumbnail.width']  = 75;
        this.properties['chart.zoom.thumbnail.height'] = 75;
        
        // Check the common library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[RADAR] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * A simple setter
    * 
    * @param string name  The name of the property to set
    * @param string value The value of the property
    */
    RGraph.Radar.prototype.Set = function (name, value)
    {
        this.properties[name.toLowerCase()] = value;
    }
    
    
    /**
    * A simple getter
    * 
    * @param string name The name of the property to get
    */
    RGraph.Radar.prototype.Get = function (name)
    {
        return this.properties[name.toLowerCase()];
    }

    
    /**
    * This method draws the radar chart
    */
    RGraph.Radar.prototype.Draw = function ()
    {
        // Calculate the radius
        this.radius       = (Math.min(this.canvas.width, this.canvas.height) / 2);
        this.centerx      = this.Get('chart.gutter') + this.radius;
        this.centery      = this.canvas.height / 2;
        this.angles       = [];
        this.total        = 0;
        this.startRadians = 0;

        this.DrawBackground();
        this.DrawRadar();
        this.DrawLabels();

        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);

        /**
        * Tooltips
        */
        if (this.Get('chart.tooltips').length) {

            /**
            * Register this object for redrawing
            */
            RGraph.Register(this);
        
            /**
            * The onclick event
            */
            this.canvas.onclick = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                RGraph.Redraw();

                var mouseCoords = RGraph.getMouseXY(e);

                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var obj     = e.target.__object__;
                var r       = e.target.__object__.radius;
                var x       = mouseCoords[0] - obj.centerx;
                var y       = mouseCoords[1] - obj.centery;
                var theta   = Math.atan(y / x); // RADIANS
                var hyp     = theta == 0 ? 0: (y / Math.sin(theta));


                // Put theta in DEGREES
                 theta *= 57.3

                if (!obj.Get('chart.tooltips')) {
                    return;
                }

                hyp = Math.abs(hyp);

                /**
                * Account for the correct quadrant
                */
                if (x < 0 && y > 0) {
                    theta += 180;
                } else if (x <= 0 && y <= 0) {
                    theta += 180;
                } else if (x >= 0 && y < 0) {
                    theta += 360;
                }


                /**
                * The angles for each segment are stored in "angles",
                * so go through that checking if the mouse position corresponds
                */
                theta = parseInt(theta);

                for (i=0; i<obj.angles.length; ++i) {

                    if (theta >= parseInt(obj.angles[i][0]) && theta <= parseInt(obj.angles[i][1]) && hyp <= obj.angles[i][2]) {

                        context.lineWidth = 2;
                        
                        /**
                        * Draw a white segment where the one that has been clicked on was
                        */
                        context.fillStyle = 'rgba(255,255,255,0.7)';
                        context.strokeStyle = 'black';
                        context.beginPath();
                        context.moveTo(obj.centerx, obj.centery);
                        context.arc(obj.centerx, obj.centery, obj.angles[i][2], obj.angles[i][0] / 57.3, obj.angles[i][1] / 57.3, 0);
                        context.stroke();
                        context.fill();
                        
                        /**
                        * If a tooltip is defined, show it
                        */
                        if (obj.Get('chart.tooltips')[i]) {
                            // FIXME MSIE COMPAT - doesn't support pageX or pageY
                            RGraph.Tooltip(canvas, obj.Get('chart.tooltips')[i], e.pageX, e.pageY);
                        }
                        
                        e.stopPropagation = true;
                        e.cancelBubble    = true;
                        return;
                    }
                }
            }
        
            /**
            * The onmousemove event
            */
            this.canvas.onmousemove = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                var mouseCoords = RGraph.getMouseXY(e);

                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var obj     = e.target.__object__;
                var r       = e.target.__object__.radius;
                var x       = mouseCoords[0] - obj.centerx;
                var y       = mouseCoords[1] - obj.centery;
                var theta   = Math.atan(y / x); // RADIANS
                var hyp     = theta == 0 ? 0 : (y / Math.sin(theta));

                // Put theta in DEGREES
                 theta *= 57.3

                if (!obj.Get('chart.tooltips')) {
                    return;
                }

                hyp = Math.abs(hyp);

                /**
                * Account for the correct quadrant
                */
                if (x <= 0 && y > 0) {
                    theta += 180;
                } else if (x <= 0 && y <= 0) {
                    theta += 180;
                } else if (x >= 0 && y < 0) {
                    theta += 360;
                }

                theta = parseInt(theta);

                /**
                * The angles for each segment are stored in "angles",
                * so go through that checking if the mouse position corresponds
                */
                for (i=0; i<obj.angles.length; ++i) {
                    if (theta >= parseInt(obj.angles[i][0]) && theta <= parseInt(obj.angles[i][1]) && hyp <= obj.angles[i][2]) {
                    
                        canvas.style.cursor = document.all ? 'hand' : 'pointer';
                        
                        e.stopPropagation = true;
                        e.cancelBubble    = true;
                        return;
                    }
                }

                canvas.style.cursor = null;
            }
        
        // This resets the canvas events - getting rid of any installed event handlers
        } else {
            this.canvas.onclick     = null;
            this.canvas.onmousemove = null;
        }
        
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
    * This method draws the radar charts background
    */
    RGraph.Radar.prototype.DrawBackground = function ()
    {
        this.context.lineWidth = 1;
    
        // Draw the background grey circles
        this.context.strokeStyle = '#ccc';
        for (var i=15; i<this.radius - this.Get('chart.gutter'); i+=15) {// Radius must be greater than 0 for Opera to work
            this.context.moveTo(this.centerx + i, this.centery);
    
            // Radius must be greater than 0 for Opera to work
            this.context.arc(this.centerx, this.centery, i, 0, 2 * Math.PI, 1);
        }
        this.context.stroke();
        
        this.context.beginPath();
        this.context.strokeStyle = 'black';
    
        // Draw the X axis
        this.context.moveTo(this.centerx - this.radius + this.Get('chart.gutter'), this.centery);
        this.context.lineTo(this.centerx + this.radius - this.Get('chart.gutter'), this.centery);
    
        // Draw the X ends
        this.context.moveTo(this.centerx - this.radius + this.Get('chart.gutter'), this.centery - 5);
        this.context.lineTo(this.centerx - this.radius + this.Get('chart.gutter'), this.centery + 5);
        this.context.moveTo(this.centerx + this.radius - this.Get('chart.gutter'), this.centery - 5);
        this.context.lineTo(this.centerx + this.radius - this.Get('chart.gutter'), this.centery + 5);
        
        // Draw the X check marks
        for (var i=(this.centerx - this.radius + this.Get('chart.gutter')); i<(this.centerx + this.radius - this.Get('chart.gutter')); i+=20) {
            this.context.moveTo(i,  this.centery - 3);
            this.context.lineTo(i,  this.centery + 3);
        }
        
        // Draw the Y check marks
        for (var i=(this.centery - this.radius + this.Get('chart.gutter')); i<(this.centery + this.radius - this.Get('chart.gutter')); i+=20) {
            this.context.moveTo(this.centerx - 3, i);
            this.context.lineTo(this.centerx + 3, i);
        }
    
        // Draw the Y axis
        this.context.moveTo(this.centerx, this.centery - this.radius + this.Get('chart.gutter'));
        this.context.lineTo(this.centerx, this.centery + this.radius - this.Get('chart.gutter'));
    
        // Draw the Y ends
        this.context.moveTo(this.centerx - 5, this.centery - this.radius + this.Get('chart.gutter'));
        this.context.lineTo(this.centerx + 5, this.centery - this.radius + this.Get('chart.gutter'));
    
        this.context.moveTo(this.centerx - 5, this.centery + this.radius - this.Get('chart.gutter'));
        this.context.lineTo(this.centerx + 5, this.centery + this.radius - this.Get('chart.gutter'));
        
        // Stroke it
        this.context.closePath();
        this.context.stroke();
    }
    
    /**
    * This method draws a set of data on the graph
    */
    RGraph.Radar.prototype.DrawRadar = function ()
    {
        var data = this.data;

        // Must be at least two data points
        if (data.length < 2) {
            alert('[RADAR] Must be at least two data points! [' + data + ']');
            return;
        }
    
        // Work out the maximum value and the sum
        this.max = RGraph.array_max(data);
        this.sum = RGraph.array_sum(data);
        
        // Move to the centre
        this.context.moveTo(this.centerx, this.centery);
    
        this.context.stroke(); // Stroke the background so it stays grey
    
        for (var i=0; i<this.data.length; ++i) {
            // Set the stroke colour to the colour - currently hard coded to black
            this.context.strokeStyle = '#000';
            this.context.fillStyle   = this.Get('chart.colors')[i];
    
            var segmentRadians = (1 / this.data.length) * (2 * Math.PI)
    
            this.context.beginPath(); // Begin the segment   
                var radius = (this.data[i] / this.max) * (this.radius - this.Get('chart.gutter') - 10);
                this.context.arc(this.centerx, this.centery, radius, this.startRadians, (this.startRadians + segmentRadians), 0);
                this.context.lineTo(this.centerx, this.centery);
                this.context.fill();
            this.context.closePath(); // End the segment
            
            // Store the start and end angles
            this.angles.push([this.startRadians * 57.3, (this.startRadians + segmentRadians) * 57.3, radius]);

            this.startRadians += segmentRadians;
            this.context.stroke();
        }

        // Draw the title if any has been set
        if (this.Get('chart.title')) {
            RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.Get('chart.gutter'), this.centerx, this.Get('chart.text.size') + 2);
        }
    }

    /**
    * Unsuprisingly, draws the labels
    */
    RGraph.Radar.prototype.DrawLabels = function ()
    {
        if (this.Get('chart.labels').length) {
            RGraph.DrawKey(this, this.Get('chart.labels'), this.Get('chart.colors'));
        }
    }