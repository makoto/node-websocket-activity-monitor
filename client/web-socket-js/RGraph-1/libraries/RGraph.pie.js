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
    * The pie chart constructor
    * 
    * @param data array The data to be represented on the pie chart
    */
    RGraph.Pie = function (id, data)
    {
        this.id         = id;
        this.canvas     = document.getElementById(id);
        this.context    = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.total      = 0;
        this.subTotal   = 0;
        this.angles     = [];
        this.data       = data;
        this.properties = [];
        this.type       = 'pie';


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);


        this.properties['chart.colors']         = ['rgb(255,0,0)',   '#ddd',
                                                   'rgb(0,255,0)',   'rgb(0,0,255)',
                                                   'pink', 'yellow',
                                                   'red',            'rgb(0,255,255)',
                                                   'black',          'white'];
        this.properties['chart.strokestyle']     = '#999';
        this.properties['chart.linewidth']       = 1;
        this.properties['chart.labels']          = [];
        this.properties['chart.segments']        = [];
        this.properties['chart.gutter']          = 25;
        this.properties['chart.title']           = '';
        this.properties['chart.title.vpos']      = null;
        this.properties['chart.shadow']          = false;
        this.properties['chart.shadow.color']    = 'rgba(0,0,0,0.5)';
        this.properties['chart.shadow.offsetx']  = 3;
        this.properties['chart.shadow.offsety']  = 3;
        this.properties['chart.shadow.blur']     = 3;
        this.properties['chart.text.size']       = 10;
        this.properties['chart.text.color']      = 'black';
        this.properties['chart.text.font']       = 'Verdana';
        this.properties['chart.contextmenu']     = null;
        this.properties['chart.tooltips']        = [];
        this.properties['chart.tooltip.effect']  = 'fade';
        this.properties['chart.isdonut']         = false;
        this.properties['chart.radius']          = null;
        this.properties['chart.highlight.style'] = '3d';
        this.properties['chart.border']          = false;
        this.properties['chart.border.color']    = 'rgba(255,255,255,0.5)';
        this.properties['chart.key.background']  = 'white';
        this.properties['chart.key.position']  = 'graph';
        this.properties['chart.annotatable']     = false;
        this.properties['chart.annotate.color']  = 'black';
        this.properties['chart.align']           = 'center';
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
        
        /**
        * Calculate the total
        */
        for (var i=0,len=data.length; i<len; i++) {
            this.total += data[i];
        }
        
        // Check the common library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[PIE] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * A generic setter
    */
    RGraph.Pie.prototype.Set = function (name, value)
    {
        this.properties[name] = value;
    }


    /**
    * A generic getter
    */
    RGraph.Pie.prototype.Get = function (name)
    {
        return this.properties[name];
    }


    /**
    * This draws the pie chart
    */
    RGraph.Pie.prototype.Draw = function ()
    {
        this.diameter    = Math.min(this.canvas.height, this.canvas.width) - (2 * this.Get('chart.gutter'));
        this.radius      = this.Get('chart.radius') ? this.Get('chart.radius') : this.diameter / 2;
        // this.centerx now defined below
        this.centery     = this.canvas.height / 2;
        this.subTotal    = 0;
        this.angles      = [];
        
        /**
        * Alignment (Pie is center aligned by default) Only if centerx is not defined - donut defines the centerx
        */
        if (!this.centerx) {
            if (this.Get('chart.align') == 'left') {
                this.centerx = this.radius + this.Get('chart.gutter');
            
            } else if (this.Get('chart.align') == 'right') {
                this.centerx = this.canvas.width - (this.radius + this.Get('chart.gutter'));
            
            } else {
                this.centerx = this.canvas.width / 2;
            }
        }


        /**
        * Draw the shadow if required
        */
        if (this.Get('chart.shadow')) {
            this.context.beginPath();
            this.context.fillStyle = 'white';
            
            this.context.shadowColor   = this.Get('chart.shadow.color');
            this.context.shadowBlur    = this.Get('chart.shadow.blur');
            this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
            this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
            
            this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, 0);
            
            this.context.fill();
            
            // Now turn off the shadow
            this.context.shadowColor   = 'rgba(0,0,0,0)';
            this.context.shadowBlur    = 0;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
        }

        /**
        * The total of the array of values
        */
        this.total = RGraph.array_sum(this.data);

        for (var i=0,len=this.data.length; i<len; i++) {
            var angle = (this.data[i] / this.total) * 360;
    
            this.DrawSegment(angle,
                             this.Get('chart.colors')[i],
                             i == (this.data.length - 1));
        }

        /**
        * Redraw the seperating lines
        */
        if (this.Get('chart.linewidth') > 0) {
            this.context.beginPath();
            this.context.lineWidth = this.Get('chart.linewidth');
            this.context.strokeStyle = this.Get('chart.strokestyle');

            for (var i=0,len=this.angles.length; i<len; ++i) {
                this.context.moveTo(this.centerx, this.centery);
                this.context.arc(this.centerx, this.centery, this.radius, this.angles[i][0] / 57.3, this.angles[i][0] / 57.3, 0);
            }
            
            this.context.stroke();
            
            /**
            * And finally redraw the border
            */
            this.context.beginPath();
            this.context.moveTo(this.centerx, this.centery);
            this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, 0);
            this.context.stroke();
        }

        

        /**
        * Draw the labels
        */
        this.DrawLabels();

        /**
        * Draw the title
        */
        if (this.Get('chart.align') == 'left') {
            var centerx = this.radius + this.Get('chart.gutter');

        } else if (this.Get('chart.align') == 'right') {
            var centerx = this.canvas.width - (this.radius + this.Get('chart.gutter'));

        } else {
            var centerx = null;
        }

        RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.Get('chart.gutter'), centerx, this.Get('chart.text.size') + 2);
        
        
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

                var mouseCoords = RGraph.getMouseXY(e);

                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var obj     = e.target.__object__;
                var r       = e.target.__object__.radius;
                var x       = mouseCoords[0] - obj.centerx;
                var y       = mouseCoords[1] - obj.centery;
                var theta   = Math.atan(y / x); // RADIANS
                var hyp     = y / Math.sin(theta);

                RGraph.Redraw();

                // Put theta in DEGREES
                 theta *= 57.3

                if (!obj.Get('chart.tooltips')) {
                    return;
                }

                // hyp should not be greater than radius
                if (   (isNaN(hyp) && Math.abs(mouseCoords[0]) < (obj.centerx - r) )
                    || (isNaN(hyp) && Math.abs(mouseCoords[0]) > (obj.centerx + r))
                    || (!isNaN(hyp) && Math.abs(hyp) > r)) {
                    return;

                /**
                * If it's actually a donut make sure the hyp is bigger
                * than the size of the hole in the middle
                */
                } else if (obj.Get('chart.isdonut') && Math.abs(hyp) < (obj.radius / 2)) {
                    return;
                }

                /**
                * Account for the correct quadrant
                */
                if (x < 0 && y >= 0) {
                    theta += 180;
                } else if (x < 0 && y < 0) {
                    theta += 180;
                } else if (x > 0 && y < 0) {
                    theta += 360;
                }

                /**
                * The angles for each segment are stored in "angles",
                * so go through that checking if the mouse position corresponds
                */
                var isDonut = obj.Get('chart.isdonut');
                var hStyle  = obj.Get('chart.highlight.style');

                for (i=0; i<obj.angles.length; ++i) {
                    if (theta >= obj.angles[i][0] && theta < obj.angles[i][1]) {
                        if (isDonut || hStyle == '2d') {
                            
                            context.beginPath();
                            context.fillStyle = 'rgba(255,255,255,0.5)';
                            context.strokeStyle = 'rgba(0,0,0,0)';
                            context.moveTo(obj.centerx, obj.centery);
                            context.arc(obj.centerx, obj.centery, obj.radius, RGraph.degrees2Radians(obj.angles[i][0]), RGraph.degrees2Radians(obj.angles[i][1]), 0);
                            context.lineTo(obj.centerx, obj.centery);
                            context.closePath();
                            
                            context.fill();
                            context.stroke();

                        } else {

                            context.lineWidth = 2;

                            /**
                            * Draw a white segment where the one that has been clicked on was
                            */
                            context.fillStyle = 'white';
                            context.strokeStyle = 'white';
                            context.beginPath();
                            context.moveTo(obj.centerx, obj.centery);
                            context.arc(obj.centerx, obj.centery, obj.radius, obj.angles[i][0] / 57.3, obj.angles[i][1] / 57.3, 0);
                            context.stroke();
                            context.fill();
                            
                            context.lineWidth = 1;

                            context.shadowColor   = '#666';
                            context.shadowBlur    = 3;
                            context.shadowOffsetX = 3;
                            context.shadowOffsetY = 3;

                            // Draw the new segment
                            context.beginPath();
                                context.fillStyle   = obj.Get('chart.colors')[i];
                                context.strokeStyle = 'rgba(0,0,0,0)';
                                context.moveTo(obj.centerx - 3, obj.centery - 3);
                                context.arc(obj.centerx - 3, obj.centery - 3, obj.radius, RGraph.degrees2Radians(obj.angles[i][0]), RGraph.degrees2Radians(obj.angles[i][1]), 0);
                                context.lineTo(obj.centerx - 3, obj.centery - 3);
                            context.closePath();
                            
                            context.stroke();
                            context.fill();
                            
                            // Turn off the shadow
                            RGraph.NoShadow(obj);
                            
                            /**
                            * If a border is defined, redraw that
                            */
                            if (obj.Get('chart.border')) {
                                context.beginPath();
                                context.strokeStyle = obj.Get('chart.border.color');
                                context.lineWidth = 5;
                                context.arc(obj.centerx - 3, obj.centery - 3, obj.radius - 2, RGraph.degrees2Radians(obj.angles[i][0]), RGraph.degrees2Radians(obj.angles[i][1]), 0);
                                context.stroke();
                            }
                        }
                        
                        /**
                        * If a tooltip is defined, show it
                        */
                        if (obj.Get('chart.tooltips')[i]) {
                            RGraph.Tooltip(canvas, obj.Get('chart.tooltips')[i], e.pageX, e.pageY);
                        }

                        /**
                        * Need to redraw the key?
                        */
                        if (obj.Get('chart.key') && obj.Get('chart.key').length && obj.Get('chart.key.position') == 'graph') {
                            RGraph.DrawKey(obj, obj.Get('chart.key'), obj.Get('chart.colors'));
                        }

                        e.stopPropagation = true;
                        e.cancelBubble    = true;

                        return;
                    }
                }
            }


            /**
            * The onmousemove event for changing the cursor
            */
            this.canvas.onmousemove = function (e)
            {
                var e = RGraph.FixEventObject(document.all ? event : e);
                var mouseCoords = RGraph.getMouseXY(e);
                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var obj     = e.target.__object__;
                var r       = e.target.__object__.radius;
                var x       = mouseCoords[0] - obj.centerx;
                var y       = mouseCoords[1] - obj.centery;
                var theta   = Math.atan(y / x); // RADIANS
                var hyp     = y / Math.sin(theta);
                var angles  = obj.angles;

                // Put theta in DEGREES
                 theta *= 57.3

                if (!obj.Get('chart.tooltips')) {
                    return;
                }

                // hyp should not be greater than radius
                if (   (isNaN(hyp) && Math.abs(mouseCoords[0]) < (obj.centerx - r))
                    || (isNaN(hyp) && Math.abs(mouseCoords[0]) > (obj.centerx + r))
                    || (!isNaN(hyp) && Math.abs(hyp) > r)
                    || (obj.Get('chart.isdonut') && Math.abs(hyp) < (obj.radius / 2) )
                   ) {
                    canvas.style.cursor = '';
                    return;

                /**
                * If it's actually a donut make sure the hyp is bigger
                * than the size of the hole in the middle
                */
                } else if (obj.Get('chart.isdonut') && Math.abs(hyp) < (obj.radius / 2)) {
                    return;
                }
            
                /**
                * Account for the correct quadrant
                */
                if (x <= 0 && y > 0) {
                    theta += 180;
                } else if (x <= 0 && y < 0) {
                    theta += 180;
                } else if (x >= 0 && y < 0) {
                    theta += 360;
                }
            
                /**
                * The angles for each segment are stored in "angles",
                * so go through that checking if the mouse position corresponds
                */
                for (i=0; i<angles.length; ++i) {
                    if (theta >= angles[i][0] && theta < angles[i][1]) {
                        
                        canvas.style.cursor = 'pointer';

                        e.stopPropagation = true;
                        e.cancelBubble    = true;
                        return;
                    }
                }
                
                /**
                * Put the cursor back to null
                */
                canvas.style.cursor = '';
            }

        // This resets the canvas events - getting rid of any installed event handlers
        } else {
            this.canvas.onclick     = null;
            this.canvas.onmousemove = null;
        }


        /**
        * If a border is pecified, draw it
        */
        if (this.Get('chart.border')) {
            this.context.beginPath();
            this.context.lineWidth = 5;
            this.context.strokeStyle = this.Get('chart.border.color');

            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 2,
                             0,
                             6.28,
                             0);

            this.context.stroke();
        }
        
        /**
        * Draw the kay if desired
        */
        if (this.Get('chart.key') != null) {
            //this.Set('chart.key.position', 'graph');
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }


        /**
        * If this is actually a donut, draw a big circle in the middle
        */
        if (this.Get('chart.isdonut')) {
            this.context.beginPath();
            this.context.strokeStyle = this.Get('chart.strokestyle');
            this.context.fillStyle   = 'white';//this.Get('chart.fillstyle');
            this.context.arc(this.centerx, this.centery, this.radius / 2, 0, 6.28, 0);
            this.context.stroke();
            this.context.fill();
        }
        
        RGraph.NoShadow(this);
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        RGraph.Annotate(this, this.Get('chart.isdonut'));
        
        /**
        * This bit shows the mini zoom window if requested
        */
        RGraph.ShowZoomWindow(this);
    }


    /**
    * Draws a single segment of the pie chart
    * 
    * @param int degrees The number of degrees for this segment
    */
    RGraph.Pie.prototype.DrawSegment = function (degrees, color, last)
    {
        var context  = this.context;
        var canvas   = this.canvas;
        var subTotal = this.subTotal;

        context.beginPath();
            context.fillStyle   = color;
            context.strokeStyle = this.Get('chart.strokestyle');
            context.lineWidth   = 0;

            context.arc(this.centerx,
                             this.centery,
                             this.radius,
                             subTotal / 57.3,
                             (last ? 360 : subTotal + degrees) / 57.3,
                             0);
    
            context.lineTo(this.centerx, this.centery);
            
            // Keep hold of the angles
            this.angles.push([subTotal, subTotal + degrees])
        this.context.closePath();

        this.context.fill();
    
        /**
        * Calculate the segment angle
        */
        this.Get('chart.segments').push([subTotal, subTotal + degrees]);
        this.subTotal += degrees;
    }

    /**
    * Draws the graphs labels
    */
    RGraph.Pie.prototype.DrawLabels = function ()
    {
        var hAlignment = 'left';
        var vAlignment = 'center';
        var labels     = this.Get('chart.labels');
        var context    = this.context;

        /**
        * Turn the shadow off
        */
        context.shadowColor   = 'rgba(0,0,0,0)';
        context.shadowBlur    = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        
        context.fillStyle = 'black';
        context.beginPath();

        /**
        * Draw the key (ie. the labels)
        */
        if (labels && labels.length) {

            var text_size = this.Get('chart.text.size');

            for (i=0; i<labels.length; ++i) {
            
                /**
                * T|his ensures that if we're given too many labels, that we don't get an error
                */
                if (typeof(this.Get('chart.segments')[i]) == 'undefined') {
                    continue;
                }

                // Move to the centre
                context.moveTo(this.centerx,this.centery);
                
                var a = this.Get('chart.segments')[i][0] + ((this.Get('chart.segments')[i][1] - this.Get('chart.segments')[i][0]) / 2);

                /**
                * Alignment
                */
                if (a < 90) {
                    hAlignment = 'left';
                    vAlignment = 'center';
                } else if (a < 180) {
                    hAlignment = 'right';
                    vAlignment = 'center';
                } else if (a < 270) {
                    hAlignment = 'right';
                    vAlignment = 'center';
                } else if (a < 360) {
                    hAlignment = 'left';
                    vAlignment = 'center';
                }

                context.fillStyle = this.Get('chart.text.color');

                RGraph.Text(context,
                            this.Get('chart.text.font'),
                            text_size,
                            this.centerx + ((this.radius + 10)* Math.cos(a / 57.3)),
                            this.centery + (((this.radius + 10) * Math.sin(a / 57.3))),
                            labels[i],
                            vAlignment,
                            hAlignment);
            }
            
            context.fill();
        }
    }