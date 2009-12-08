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
    * The bar chart constructor
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.Bar = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'bar';
        this.max               = 0;
        this.stackedOrGrouped  = false;


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);


        // Various config type stuff
        this.properties = [];
        this.properties['chart.background.barcolor1']   = 'rgba(0,0,0,0)';
        this.properties['chart.background.barcolor2']   = 'rgba(0,0,0,0)';
        this.properties['chart.background.grid']        = true;
        this.properties['chart.background.grid.color']  = '#ddd';
        this.properties['chart.background.grid.width']  = 1;
        this.properties['chart.background.grid.hsize']  = 20;
        this.properties['chart.background.grid.vsize']  = 20;
        this.properties['chart.background.grid.vlines'] = true;
        this.properties['chart.background.grid.hlines'] = true;
        this.properties['chart.background.grid.border'] = true;
        this.properties['chart.ytickgap']               = 20;
        this.properties['chart.smallyticks']            = 3;
        this.properties['chart.largeyticks']            = 5;
        this.properties['chart.hmargin']                = 5;
        this.properties['chart.strokecolor']            = '#666';
        this.properties['chart.axis.color']             = 'black';
        this.properties['chart.gutter']                 = 25;
        this.properties['chart.labels']                 = null;
        this.properties['chart.labels.ingraph']         = null;
        this.properties['chart.labels.above']           = false;
        this.properties['chart.xaxispos']               = 'bottom';
        this.properties['chart.yaxispos']               = 'left';
        this.properties['chart.text.color']             = 'black';
        this.properties['chart.text.size']              = 10;
        this.properties['chart.text.angle']             = 0;
        this.properties['chart.text.font']              = 'Verdana';
        this.properties['chart.ymax']                   = null;
        this.properties['chart.title']                  = '';
        this.properties['chart.title.vpos']             = null;
        this.properties['chart.colors']                 = ['rgb(0,0,255)', '#0f0', '#00f', '#ff0', '#0ff', '#0f0'];
        this.properties['chart.grouping']               = 'grouped';
        this.properties['chart.variant']                = 'bar';
        this.properties['chart.shadow']                 = false;
        this.properties['chart.shadow.color']           = '#666';
        this.properties['chart.shadow.offsetx']         = 3;
        this.properties['chart.shadow.offsety']         = 3;
        this.properties['chart.shadow.blur']            = 3;
        this.properties['chart.tooltips']               = null;
        this.properties['chart.tooltip.effect']         = 'fade';
        this.properties['chart.background.hbars']       = null;
        this.properties['chart.key']                    = [];
        this.properties['chart.key.background']         = '#fff';
        this.properties['chart.key.position']           = 'graph';
        this.properties['chart.key.shadow']             = false;
        this.properties['chart.contextmenu']            = null;
        this.properties['chart.line']                   = null;
        this.properties['chart.units.pre']              = '';
        this.properties['chart.units.post']             = '';
        this.properties['chart.scale.decimals']         = 0;
        this.properties['chart.crosshairs']             = false;
        this.properties['chart.crosshairs.color']       = '#333';
        this.properties['chart.linewidth']              = null;
        this.properties['chart.annotatable']            = false;
        this.properties['chart.annotate.color']         = 'black';
        this.properties['chart.zoom.factor']            = 1.5;
        this.properties['chart.zoom.fade.in']           = true;
        this.properties['chart.zoom.fade.out']          = true;
        this.properties['chart.zoom.hdir']              = 'right';
        this.properties['chart.zoom.vdir']              = 'down';
        this.properties['chart.zoom.frames']            = 10;
        this.properties['chart.zoom.delay']             = 50;
        this.properties['chart.zoom.shadow']            = true;
        this.properties['chart.zoom.mode']              = 'canvas';
        this.properties['chart.zoom.thumbnail.width']   = 75;
        this.properties['chart.zoom.thumbnail.height']  = 75;

        // Check for support
        if (!this.canvas) {
            alert('[BAR] No canvas support');
            return;
        }
        
        // Check the canvasText library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[BAR] Fatal error: The common library does not appear to have been included');
        }

        /**
        * Determine whether the chart will contain stacked or grouped bars
        */
        for (i=0; i<data.length; ++i) {
            if (typeof(data[i]) == 'object') {
                this.stackedOrGrouped = true;
            }
        }

        // Store the data
        this.data = data;
        
        // Used to store the coords of the bars
        this.coords = [];
    }


    /**
    * A setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.Bar.prototype.Set = function (name, value)
    {
        if (name == 'chart.labels.abovebar') {
            name = 'chart.labels.above';
        }

        this.properties[name.toLowerCase()] = value;
    }


    /**
    * A getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Bar.prototype.Get = function (name)
    {
        if (name == 'chart.labels.abovebar') {
            name = 'chart.labels.above';
        }

        return this.properties[name];
    }


    /**
    * The function you call to draw the bar chart
    */
    RGraph.Bar.prototype.Draw = function ()
    {
        /**
        * Check for tooltips and alert the user that they're not supported with pyramid charts
        */
        if (   (this.Get('chart.variant') == 'pyramid' || this.Get('chart.variant') == 'dot')
            && typeof(this.Get('chart.tooltips')) == 'object'
            && this.Get('chart.tooltips')
            && this.Get('chart.tooltips').length > 0) {

            alert('[BAR] (' + this.id + ') Sorry, tooltips are not supported with dot or pyramid charts');
        }

        /**
        * Stop the coords array from growin uncontrollably
        */
        this.coords = [];

        /**
        * Work out a few things. They need to be here because they depend on things you can change before you
        * call Draw() but after you instantiate the object
        */
        this.max            = 0;
        this.grapharea      = this.canvas.height - ( (2 * this.Get('chart.gutter')));
        this.halfgrapharea  = this.grapharea / 2;
        this.halfTextHeight = this.Get('chart.text.size') / 2;

        // Progressively Draw the chart
        RGraph.background.Draw(this);

        this.Drawbars();
        this.DrawAxes();
        this.DrawLabels();


        // Draw the key if necessary
        if (this.Get('chart.key').length) {
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }
        
        
        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);


        /**
        * Is a line is defined, draw it
        */
        var line = this.Get('chart.line');

        if (line) {
            
            // Check the length of the data(s)
            if (line.original_data[0].length != this.data.length) {
                alert("[BAR] You're adding a line with a differing amount of data points to the bar chart - this is not permitted");
            }
            
            // Check the X axis positions
            if (this.Get('chart.xaxispos') != line.Get('chart.xaxispos')) {
                alert("[BAR] Using different X axis positions when combining the Bar and Line is not advised");
            }

            line.Set('chart.gutter', this.Get('chart.gutter'));
            line.Set('chart.noaxes', true);
            line.Set('chart.background.barcolor1', 'rgba(0,0,0,0)');
            line.Set('chart.background.barcolor2', 'rgba(0,0,0,0)');
            line.Set('chart.background.grid', false);
            line.Set('chart.ylabels', false);
            line.Set('chart.hmargin', (this.canvas.width - (2 * this.Get('chart.gutter'))) / (line.original_data[0].length * 2));
            
            // If a custom yMax is set, use that
            if (this.Get('chart.ymax')) {
                line.Set('chart.ymax', this.Get('chart.ymax'));
            }

            line.Draw();
        }


        /**
        * Draw "in graph" labels
        */
        RGraph.DrawInGraphLabels(this);
        
        /**
        * Draw crosschairs
        */
        RGraph.DrawCrosshairs(this);
        
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
    * Draws the charts axes
    */
    RGraph.Bar.prototype.DrawAxes = function ()
    {
        var gutter = this.Get('chart.gutter');

        this.context.beginPath();
        this.context.strokeStyle = this.Get('chart.axis.color');

        // Draw the Y axis
        if (this.Get('chart.yaxispos') == 'right') {
            this.context.moveTo(this.canvas.width - gutter, gutter);
            this.context.lineTo(this.canvas.width - gutter, this.canvas.height - gutter);
        } else {
            this.context.moveTo(gutter, gutter);
            this.context.lineTo(gutter, this.canvas.height - gutter);
        }
        
        // Draw the X axis
        this.context.moveTo(gutter, (this.Get('chart.xaxispos') == 'center' ? this.canvas.height / 2 : this.canvas.height - gutter));
        this.context.lineTo(this.canvas.width - gutter, this.Get('chart.xaxispos') == 'center' ? this.canvas.height / 2 : this.canvas.height - gutter);

        // Draw the Y tickmarks
        var yTickGap = (this.canvas.height - (2 * this.Get('chart.gutter'))) / 10;
        var xpos     = this.Get('chart.yaxispos') == 'left' ? gutter : this.canvas.width - gutter;

        for (y=gutter;
             this.Get('chart.xaxispos') == 'center' ? y <= (this.canvas.height - gutter) : y < (this.canvas.height - gutter);
             y += yTickGap) {

            if (this.Get('chart.xaxispos') == 'center' && y == (this.canvas.height / 2)) continue;
            
            this.context.moveTo(xpos, y);
            this.context.lineTo(xpos + (this.Get('chart.yaxispos') == 'left' ? -3 : 3), y);
        }

        // Draw the X tickmarks
        xTickGap = (this.canvas.width - (2 * gutter) ) / this.data.length;
        yStart   = this.canvas.height - gutter;
        yEnd     = (this.canvas.height - gutter) + 3;
        
        //////////////// X TICKS ////////////////

        // Now move the Y start end positions down if the axis is set to center
        if (this.Get('chart.xaxispos') == 'center') {
            yStart = (this.canvas.height / 2) + 3;
            yEnd   = (this.canvas.height / 2) - 3;
        }

        for (x=gutter + (this.Get('chart.yaxispos') == 'left' ? xTickGap : 0); x<this.canvas.width - gutter + (this.Get('chart.yaxispos') == 'left' ? 5 : 0); x+=xTickGap) {
            this.context.moveTo(x, yStart);
            this.context.lineTo(x, yEnd);
        }

        //////////////// X TICKS ////////////////

        this.context.stroke();
    }


    /**
    * Draws the bars
    */
    RGraph.Bar.prototype.Drawbars = function ()
    {
        this.context.lineWidth   = 1;
        this.context.strokeStyle = this.Get('chart.strokecolor');
        this.context.fillStyle   = this.Get('chart.colors')[0];
        var prevX                = 0;
        var prevY                = 0;

        /**
        * Work out the max value
        */
        if (this.Get('chart.ymax')) {
            this.max = this.Get('chart.ymax');

            this.scale = [
                          (this.max * (1/5)).toFixed(this.Get('chart.scale.decimals')),
                          (this.max * (2/5)).toFixed(this.Get('chart.scale.decimals')),
                          (this.max * (3/5)).toFixed(this.Get('chart.scale.decimals')),
                          (this.max * (4/5)).toFixed(this.Get('chart.scale.decimals')),
                          this.max.toFixed(this.Get('chart.scale.decimals'))
                         ];
        } else {
            for (i=0; i<this.data.length; ++i) {
                if (typeof(this.data[i]) == 'object') {
                    var value = this.Get('chart.grouping') == 'grouped' ? Number(RGraph.array_max(this.data[i], true)) : Number(RGraph.array_sum(this.data[i])) ;

                } else {
                    var value = Number(this.data[i]);
                }

                this.max = Math.max(Math.abs(this.max), Math.abs(value));
            }

            this.scale = RGraph.getScale(this.max);
            this.max   = this.scale[4];

            if (this.Get('chart.scale.decimals')) {
                var decimals = this.Get('chart.scale.decimals');

                this.scale[0] = Number(this.scale[0]).toFixed(decimals);
                this.scale[1] = Number(this.scale[1]).toFixed(decimals);
                this.scale[2] = Number(this.scale[2]).toFixed(decimals);
                this.scale[3] = Number(this.scale[3]).toFixed(decimals);
                this.scale[4] = Number(this.scale[4]).toFixed(decimals);
            }
        }

        /**
        * Draw horizontal bars here
        */
        if (this.Get('chart.background.hbars') && this.Get('chart.background.hbars').length > 0) {
            RGraph.DrawBars(this);
        }

        var variant = this.Get('chart.variant');
        
        /**
        * Draw the 3D axes is necessary
        */
        if (variant == '3d') {
            RGraph.Draw3DAxes(this);
        }

        /**
        * Get the variant once, and draw the bars, be they regular, stacked or grouped
        */
        for (i=0; i<this.data.length; ++i) {

            // Work out the width and height
            var width  = (this.canvas.width - (2 * this.Get('chart.gutter')) ) / this.data.length;;
            var height = (RGraph.array_sum(this.data[i]) / this.max) * (this.canvas.height - (2 * this.Get('chart.gutter')) );

            var orig_height = height;

            // Half the height if the Y axis is at the center
            if (this.Get('chart.xaxispos') == 'center') {
                height /= 2;
            }

            var x      = (i * width) + this.Get('chart.gutter');
            var y      = this.Get('chart.xaxispos') == 'center' ? (this.canvas.height / 2) - height : this.canvas.height - height - this.Get('chart.gutter');
            var hmargin = this.Get('chart.hmargin');
            var gutter = this.Get('chart.gutter');

            // Account for negative lengths - Some browsers (eg Chrome) don't like a negative value
            if (height < 0) {
                y += height;
                height = Math.abs(height);
            }

            /**
            * Turn on the shadow if need be
            */
            if (this.Get('chart.shadow')) {
                this.context.shadowColor   = this.Get('chart.shadow.color');
                this.context.shadowBlur    = this.Get('chart.shadow.blur');
                this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
            }

            /**
            * Draw the bar
            */
            this.context.beginPath();
                if (typeof(this.data[i]) == 'number') {
                    
                    var barWidth = width - (2 * hmargin);
                    
                    // Set the fill color
                    this.context.strokeStyle = this.Get('chart.strokecolor');
                    this.context.fillStyle = this.Get('chart.colors')[0];

                    // Regular bar
                    if (variant == 'bar' || variant == '3d') {

                        this.context.strokeRect(x + hmargin, y, barWidth, height);
                        this.context.fillRect(x + hmargin, y, width - (2 * hmargin), height);

                        this.coords[i] = [x, y, width, height];
                        
                        // This bit draws the text labels that appear above the bars if requested
                        if (this.Get('chart.labels.above')) {

                            // Turn off any shadow
                            if (this.Get('chart.shadow')) {
                                RGraph.NoShadow(this);
                            }

                            var yPos = y - 3;

                            // Account for negative bars
                            if (this.data[i] < 0) {
                                yPos += height + 6 + (this.Get('chart.text.size') - 4);
                            }

                            this.context.fillStyle = this.Get('chart.text.color');
                            RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size') - 3, x + hmargin + (barWidth / 2), yPos, RGraph.number_format(this.data[i], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
                        }

                        // 3D effect
                        if (variant == '3d') {
                            var prevStrokeStyle = this.context.strokeStyle;
                            var prevFillStyle   = this.context.fillStyle;

                            // Draw the top
                            this.context.beginPath();
                                this.context.moveTo(x + hmargin, y);
                                this.context.lineTo(x + hmargin + 10, y - 5);
                                this.context.lineTo(x + hmargin + 10 + barWidth, y - 5);
                                this.context.lineTo(x + hmargin + barWidth, y);
                            this.context.closePath();

                            this.context.stroke();                        
                            this.context.fill();

                            // Draw the right hand side
                            this.context.beginPath();
                                this.context.moveTo(x + hmargin + barWidth, y);
                                this.context.lineTo(x + hmargin + barWidth + 10, y - 5);
                                this.context.lineTo(x + hmargin + barWidth + 10, y + height - 5);
                                this.context.lineTo(x + hmargin + barWidth, y + height);
                            this.context.closePath();
    
                            this.context.stroke();                        
                            this.context.fill();

                            // Draw the darker top section
                            this.context.beginPath();
                                this.context.fillStyle = 'rgba(255,255,255,0.3)';
                                this.context.moveTo(x + hmargin, y);
                                this.context.lineTo(x + hmargin + 10, y - 5);
                                this.context.lineTo(x + hmargin + 10 + barWidth, y - 5);
                                this.context.lineTo(x + hmargin + barWidth, y);
                                this.context.lineTo(x + hmargin, y);
                            this.context.closePath();
    
                            this.context.stroke();
                            this.context.fill();

                            // Draw the darker right side section
                            this.context.beginPath();
                                this.context.fillStyle = 'rgba(0,0,0,0.4)';
                                this.context.moveTo(x + hmargin + barWidth, y);
                                this.context.lineTo(x + hmargin + barWidth + 10, y - 5);
                                this.context.lineTo(x + hmargin + barWidth + 10, y - 5 + height);
                                this.context.lineTo(x + hmargin + barWidth, y + height);
                                this.context.lineTo(x + hmargin + barWidth, y);
                            this.context.closePath();

                            this.context.stroke();                        
                            this.context.fill();

                            this.context.strokeStyle = prevStrokeStyle;
                            this.context.fillStyle   = prevFillStyle;
                        }
                    
                    // Dot chart
                    } else if (variant == 'dot') {

                        this.context.beginPath();
                        this.context.moveTo(x + (width / 2), y);
                        this.context.lineTo(x + (width / 2), y + height);
                        this.context.stroke();
                        
                        this.context.beginPath();
                        this.context.fillStyle = this.Get('chart.colors')[i];
                        this.context.arc(x + (width / 2), y + (this.data[i] > 0 ? 0 : height), 2, 0, 6.28, 0);
                        this.context.stroke();
                        this.context.fill();
                    
                    // Pyramid chart
                    } else if (variant == 'pyramid') {

                        this.context.beginPath();
                            var startY = (this.Get('chart.xaxispos') == 'center' ? (this.canvas.height / 2) : (this.canvas.height - this.Get('chart.gutter')));
                        
                            this.context.moveTo(x + hmargin, startY);
                            this.context.lineTo(
                                                x + hmargin + (barWidth / 2),
                                                y + (this.Get('chart.xaxispos') == 'center' && (this.data[i] < 0) ? height : 0)
                                               );
                            this.context.lineTo(x + hmargin + barWidth, startY);
                        
                        this.context.closePath();
                        
                        this.context.stroke();
                        this.context.fill();
                    
                    // Arrow chart
                    } else if (variant == 'arrow') {
                        var startY = (this.Get('chart.xaxispos') == 'center' ? (this.canvas.height / 2) : (this.canvas.height - this.Get('chart.gutter')));

                        this.context.lineWidth = this.Get('chart.linewidth') ? this.Get('chart.linewidth') : 1;
                        this.context.lineCap = 'round';

                        this.context.beginPath();

                            this.context.moveTo(x + hmargin + (barWidth / 2), startY);
                            this.context.lineTo(x + hmargin + (barWidth / 2), y + (this.Get('chart.xaxispos') == 'center' && (this.data[i] < 0) ? height : 0));
                            this.context.arc(x + hmargin + (barWidth / 2), y + (this.Get('chart.xaxispos') == 'center' && (this.data[i] < 0) ? height : 0), 5, this.data[i] > 0 ? 0.785 : 5.495, this.data[i] > 0 ? 0.785 : 5.495, 0);

                            this.context.moveTo(x + hmargin + (barWidth / 2), y + (this.Get('chart.xaxispos') == 'center' && (this.data[i] < 0) ? height : 0));
                            this.context.arc(x + hmargin + (barWidth / 2), y + (this.Get('chart.xaxispos') == 'center' && (this.data[i] < 0) ? height : 0), 5, this.data[i] > 0 ? 2.355 : 3.925, this.data[i] > 0 ? 2.355 : 3.925, 0);

                        this.context.stroke();
                        
                        this.context.lineWidth = 1;

                    // Unknown variant type
                    } else {
                        alert('[BAR] Warning! Unknown chart.variant: ' + variant);
                    }

                    this.coords.push([x, y, width, height]);


                /**
                * Stacked bar
                */
                } else if (typeof(this.data[i]) == 'object' && this.Get('chart.grouping') == 'stacked') {
                    
                    var barWidth     = width - (2 * hmargin);
                    var redrawCoords = [];// Necessary to draw if the shadow is enabled
                    var startY       = 0;
                    var hmargin      = this.Get('chart.hmargin');

                    for (j=0; j<this.data[i].length; ++j) {
                    
                        // Stacked bar chart and X axis pos in the middle - poitless since negative values are not permitted
                        if (this.Get('chart.xaxispos') == 'center') {
                            alert("[BAR] It's pointless having the X axis position at the center on a stacked bar chart. Put it at the bottom.");
                            return;
                        }

                        // Negative values not permitted for the stacked chart
                        if (this.data[i][j] < 0) {
                            alert('[BAR] Negative values are not permitted with a stacked bar chart. Try a grouped one instead.');
                            return;
                        }

                        // Set the fill and stroke colors
                        this.context.strokeStyle = this.Get('chart.strokecolor');
                        this.context.fillStyle = this.Get('chart.colors')[j];

                        var height = (this.data[i][j] / this.max) * (this.canvas.height - (2 * this.Get('chart.gutter')) );

                        // If the X axis pos is in the center, we need to half the  height
                        if (this.Get('chart.xaxispos') == 'center') {
                            height /= 2;
                        }

                        var totalHeight = (RGraph.array_sum(this.data[i]) / this.max) * (this.canvas.height - this.Get('chart.hmargin') - (2 * this.Get('chart.gutter')));

                        this.context.strokeRect(x + hmargin, y, width - (2 * hmargin), height);
                        this.context.fillRect(x + hmargin, y, width - (2 * hmargin), height);

                        /**
                        * Store the coords for tooltips
                        */
                        this.coords.push([x, y, width, height]);
                        
                        if (j == 0) {
                            var startY = y;
                            var startX = x;
                        }

                        /**
                        * Store the redraw coords if the shadow is enabled
                        */
                        if (this.Get('chart.shadow')) {
                            redrawCoords.push([x + hmargin, y, width - (2 * hmargin), height, this.Get('chart.colors')[j]]);
                        }

                        /**
                        * Stacked 3D effect
                        */
                        if (this.Get('chart.variant') == '3d') {

                            var prevFillStyle = this.context.fillStyle;
                            var prevStrokeStyle = this.context.strokeStyle;

    
                            // Draw the top side
                            if (j == 0) {
                                this.context.beginPath();
                                    this.context.moveTo(startX + hmargin, y);
                                    this.context.lineTo(startX + 10 + hmargin, y - 5);
                                    this.context.lineTo(startX + 10 + barWidth + hmargin, y - 5);
                                    this.context.lineTo(startX + barWidth + hmargin, y);
                                this.context.closePath();
                                
                                this.context.fill();
                                this.context.stroke();
                            }

                            // Draw the side section
                            this.context.beginPath();
                                this.context.moveTo(startX + barWidth + hmargin, y);
                                this.context.lineTo(startX + barWidth + hmargin + 10, y - 5);
                                this.context.lineTo(startX + barWidth + + hmargin + 10, y - 5 + height);
                                this.context.lineTo(startX + barWidth + hmargin , y + height);
                            this.context.closePath();
                            
                            this.context.fill();
                            this.context.stroke();

                            // Draw the darker top side
                            if (j == 0) {
                                this.context.fillStyle = 'rgba(255,255,255,0.3)';
                                this.context.beginPath();
                                    this.context.moveTo(startX + hmargin, y);
                                    this.context.lineTo(startX + 10 + hmargin, y - 5);
                                    this.context.lineTo(startX + 10 + barWidth + hmargin, y - 5);
                                    this.context.lineTo(startX + barWidth + hmargin, y);
                                this.context.closePath();
                                
                                this.context.fill();
                                this.context.stroke();
                            }

                            // Draw the darker side section
                            this.context.fillStyle = 'rgba(0,0,0,0.4)';
                            this.context.beginPath();
                                this.context.moveTo(startX + barWidth + hmargin, y);
                                this.context.lineTo(startX + barWidth + hmargin + 10, y - 5);
                                this.context.lineTo(startX + barWidth + + hmargin + 10, y - 5 + height);
                                this.context.lineTo(startX + barWidth + hmargin , y + height);
                            this.context.closePath();
                            
                            this.context.fill();
                            this.context.stroke();

                            this.context.strokeStyle = prevStrokeStyle;
                            this.context.fillStyle = prevFillStyle;
                        }

                        y += height;
                    }

                    // This bit draws the text labels that appear above the bars if requested
                    if (this.Get('chart.labels.above')) {

                        // Turn off any shadow
                        RGraph.NoShadow(this);

                        this.context.fillStyle = this.Get('chart.text.color');
                        RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size') - 3, startX + (barWidth / 2) + this.Get('chart.hmargin'), startY - (this.Get('chart.shadow') && this.Get('chart.shadow.offsety') < 0 ? 7 : 4), String(this.Get('chart.units.pre') + RGraph.array_sum(this.data[i]) + this.Get('chart.units.post')), null, 'center');
                      
                        // Turn any shadow back on
                        if (this.Get('chart.shadow')) {
                            this.context.shadowColor   = this.Get('chart.shadow.color');
                            this.context.shadowBlur    = this.Get('chart.shadow.blur');
                            this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                            this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
                        }
                    }
                    

                    /**
                    * Redraw the bars if the shadow is enabled due to hem being drawn from the bottom up, and the
                    * shadow spilling over to higher up bars
                    */
                    if (this.Get('chart.shadow')) {
                        this.context.shadowColor = 'rgba(0,0,0,0)';
                        for (k=0; k<redrawCoords.length; ++k) {
                            this.context.strokeStyle = this.Get('chart.strokecolor');
                            this.context.fillStyle = redrawCoords[k][4];
                            this.context.strokeRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);
                            this.context.fillRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);

                            this.context.stroke();
                            this.context.fill();
                        }
                        
                        redrawCoords = [];
                    }
                /**
                * Grouped bar
                */
                } else if (typeof(this.data[i]) == 'object' && this.Get('chart.grouping') == 'grouped') {

                    for (j=0; j<this.data[i].length; ++j) {
                        // Set the fill and stroke colors
                        this.context.strokeStyle = this.Get('chart.strokecolor');
                        this.context.fillStyle = this.Get('chart.colors')[j];

                        var individualBarWidth = (width - (2 * hmargin)) / this.data[i].length;
                        var height = (this.data[i][j] / this.max) * (this.canvas.height - (2 * this.Get('chart.gutter')) );

                        // If the X axis pos is in the center, we need to half the  height
                        if (this.Get('chart.xaxispos') == 'center') {
                            height /= 2;
                        }

                        var startX = x + hmargin + (j * individualBarWidth);
                        var startY = (this.Get('chart.xaxispos') == 'bottom' ? this.canvas.height : (this.canvas.height / 2) + this.Get('chart.gutter')) - this.Get('chart.gutter') - height;

                        // Account for a bug in chrome that doesn't allow negative heights
                        if (height < 0) {
                            startY += height;
                            height = Math.abs(height);
                        }

                        this.context.strokeRect(startX, startY, individualBarWidth, height);
                        this.context.fillRect(startX, startY, individualBarWidth, height);
                        y += height;

                        // This bit draws the text labels that appear above the bars if requested
                        if (this.Get('chart.labels.above')) {
                        
                            this.context.strokeStyle = 'rgba(0,0,0,0)';

                            // Turn off any shadow
                            if (this.Get('chart.shadow')) {
                                RGraph.NoShadow(this);
                            }

                            var yPos = y - 3;

                            // Account for negative bars
                            if (this.data[i][j] < 0) {
                                yPos += height + 6 + (this.Get('chart.text.size') - 4);
                            }

                            this.context.fillStyle = this.Get('chart.text.color');
                            RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size') - 3, startX + (individualBarWidth / 2) , startY - 2, this.data[i][j], null, 'center');
                          
                            // Turn any shadow back on
                            if (this.Get('chart.shadow')) {
                                this.context.shadowColor   = this.Get('chart.shadow.color');
                                this.context.shadowBlur    = this.Get('chart.shadow.blur');
                                this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                                this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
                            }
                        }

                        /**
                        * Grouped 3D effect
                        */
                        if (this.Get('chart.variant') == '3d') {
                            var prevFillStyle = this.context.fillStyle;
                            var prevStrokeStyle = this.context.strokeStyle;
                            
                            // Draw the top side
                            this.context.beginPath();
                                this.context.moveTo(startX, startY);
                                this.context.lineTo(startX + 10, startY - 5);
                                this.context.lineTo(startX + 10 + individualBarWidth, startY - 5);
                                this.context.lineTo(startX + individualBarWidth, startY);
                            this.context.closePath();
                            
                            this.context.fill();
                            this.context.stroke();
                            
                            // Draw the side section
                            this.context.beginPath();
                                this.context.moveTo(startX + individualBarWidth, startY);
                                this.context.lineTo(startX + individualBarWidth + 10, startY - 5);
                                this.context.lineTo(startX + individualBarWidth + 10, startY - 5 + height);
                                this.context.lineTo(startX + individualBarWidth , startY + height);
                            this.context.closePath();
                            
                            this.context.fill();
                            this.context.stroke();


                            // Draw the darker top side
                            this.context.fillStyle = 'rgba(255,255,255,0.3)';
                            this.context.beginPath();
                                this.context.moveTo(startX, startY);
                                this.context.lineTo(startX + 10, startY - 5);
                                this.context.lineTo(startX + 10 + individualBarWidth, startY - 5);
                                this.context.lineTo(startX + individualBarWidth, startY);
                            this.context.closePath();
                            
                            this.context.fill();
                            this.context.stroke();
                            
                            // Draw the darker side section
                            this.context.fillStyle = 'rgba(0,0,0,0.4)';
                            this.context.beginPath();
                                this.context.moveTo(startX + individualBarWidth, startY);
                                this.context.lineTo(startX + individualBarWidth + 10, startY - 5);
                                this.context.lineTo(startX + individualBarWidth + 10, startY - 5 + height);
                                this.context.lineTo(startX + individualBarWidth , startY + height);
                            this.context.closePath();
                            
                            this.context.fill();
                            this.context.stroke();


                            this.context.strokeStyle = prevStrokeStyle;
                            this.context.fillStyle = prevFillStyle;
                        }

                        this.coords.push([startX - this.Get('chart.hmargin'), startY, individualBarWidth + (2 * this.Get('chart.hmargin')), height]);
                    }
                }

            this.context.closePath();
        }

        /**
        * Turn off any shadow
        */
        RGraph.NoShadow(this);


        /**
        * Install the onclick event handler
        */
        if (this.Get('chart.tooltips')) {
        
            // Need to register this object for redrawing
            RGraph.Register(this);

            /**
            * Install the window onclick handler
            */
            window.onclick = function ()
            {
                RGraph.Redraw();
            }



            /**
            * If the cursor is over a hotspot, change the cursor to a hand
            */
            this.canvas.onmousemove = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                var canvas = document.getElementById(this.id);
                var obj = canvas.__object__;

                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = RGraph.getMouseXY(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                for (var i=0; i<obj.coords.length; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= (left + 5 /* 5 is the hmargin */ ) && mouseX <= (left + width - 5) && mouseY >= top && mouseY <= (top + height) ) {
                        canvas.style.cursor = document.all ? 'hand' : 'pointer';
                        return;
                    }
                    
                    canvas.style.cursor = null;
                }
            }

            /**
            * Install the onclick event handler for the tooltips
            */
            this.canvas.onclick = function (e)
            {
                // If the button pressed isn't the left, we're not interested
                if (e.button != 0) return;

                e = RGraph.FixEventObject(document.all ? event : e);

                var canvas = document.getElementById(this.id);
                var obj = canvas.__object__;

                /**
                * Redraw the graph first, in effect resetting the graph to as it was when it was first drawn
                * This "deselects" any already selected bar
                */
                RGraph.Redraw();
    
                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = RGraph.getMouseXY(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                for (var i=0; i<obj.coords.length; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= (left + 5 /* 5 is the hmargin */ ) && mouseX <= (left + width - 5) && mouseY >= top && mouseY <= (top + height) ) {
                        
                        obj.context.beginPath();
                        obj.context.strokeStyle = '#000';
                        obj.context.fillStyle   = 'rgba(255,255,255,0.5)';
                        obj.context.strokeRect(left + obj.Get('chart.hmargin'), top, width - (2 * obj.Get('chart.hmargin')), height);
                        obj.context.fillRect(left + obj.Get('chart.hmargin'), top, width - (2 * obj.Get('chart.hmargin')), height);
    
                        obj.context.stroke();
                        obj.context.fill();
    
                        /**
                        * Show a tooltip if it's defined
                        */
                        if (obj.Get('chart.tooltips')[i]) {
                            RGraph.Tooltip(canvas, obj.Get('chart.tooltips')[i], e.pageX, e.pageY);
                        }
                    }
                }

                /**
                * Stop the event bubbling
                */
                e.stopPropagation = true;
                e.cancelBubble    = true;
            }

            // This resets the bar graph
            if (obj = RGraph.Registry.Get('chart.tooltip')) {
                obj.style.display = 'none';
                RGraph.Registry.Set('chart.tooltip', null)
            }

        // This resets the canvas events - getting rid of any installed event handlers
        } else {
            this.canvas.onmousemove = null;
            this.canvas.onclick     = null;
        }
    }

    /**
    * Draws the labels for the graph
    */
    RGraph.Bar.prototype.DrawLabels = function ()
    {
        var context    = this.context;
        var gutter     = this.Get('chart.gutter');
        var text_angle = this.Get('chart.text.angle');
        var text_size  = this.Get('chart.text.size');
        var labels     = this.Get('chart.labels');


        // Draw the Y axis labels:
        this.Drawlabels_center();
        this.Drawlabels_bottom();


        /**
        * The X axis labels
        */
        if (typeof(labels) == 'object' && labels) {
        
            var yOffset = 13;

            /**
            * Text angle
            */
            var angle  = 0;
            var halign = 'center';

            if (text_angle == 45 || text_angle == 90) {
                angle  = -1 * text_angle;
                halign   = 'right';
                yOffset -= 5;
            }

            // Draw the X axis labels
            context.fillStyle = this.Get('chart.text.color');
            
            // How wide is each bar
            var barWidth = (this.canvas.width - (2 * gutter) ) / labels.length;
            
            // Reset the xTickGap
            xTickGap = (this.canvas.width - (2 * gutter)) / labels.length

            // Draw the X tickmarks
            var i=0;
            for (x=gutter + (xTickGap / 2); x<=this.canvas.width - gutter; x+=xTickGap) {
                RGraph.Text(context, this.Get('chart.text.font'),
                                      text_size,
                                      x,
                                      (this.canvas.height - gutter) + yOffset,
                                      String(labels[i++]),
                                      null,
                                      halign,
                                      null,
                                      angle);
            }
        }
    }

    /**
    * Draws the X axis in the middle
    */
    RGraph.Bar.prototype.Drawlabels_center = function ()
    {
        var font = this.Get('chart.text.font');
        this.context.fillStyle = this.Get('chart.text.color');

        if (this.Get('chart.xaxispos') == 'center') {
            ///////////////////////////////////////////////////////////////////////////////////

            /**
            * Draw the top labels
            */
            var interval   = (this.grapharea * (1/10) );
            var text_size  = this.Get('chart.text.size');
            var gutter     = this.Get('chart.gutter');
            var units_pre  = this.Get('chart.units.pre');
            var units_post = this.Get('chart.units.post');
            var context = this.context;
            var align   = this.Get('chart.yaxispos') == 'left' ? 'right' : 'left';
            var xpos    = this.Get('chart.yaxispos') == 'left' ? gutter - 5 : this.canvas.width - this.Get('chart.gutter') + 5;

            this.context.fillStyle = this.Get('chart.text.color');

            RGraph.Text(context, font, text_size, xpos,                gutter + this.halfTextHeight, RGraph.number_format(this.scale[4], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (1*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[3], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (2*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[2], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (3*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[1], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (4*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[0], units_pre, units_post), null, align);

            ///////////////////////////////////////////////////////////////////////////////////

            /**
            * Draw the bottom (X axis) labels
            */
            var interval = (this.grapharea) / 10;

            RGraph.Text(context, font, text_size, xpos, (this.grapharea + gutter + this.halfTextHeight) - (4 * interval), '-' + RGraph.number_format(this.scale[0], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (this.grapharea + gutter + this.halfTextHeight) - (3 * interval), '-' + RGraph.number_format(this.scale[1], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (this.grapharea + gutter + this.halfTextHeight) - (2 * interval), '-' + RGraph.number_format(this.scale[2], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (this.grapharea + gutter + this.halfTextHeight) - interval, '-' + RGraph.number_format(this.scale[3], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos,  this.grapharea + gutter + this.halfTextHeight, '-' + RGraph.number_format(this.scale[4], units_pre, units_post), null, align);

            ///////////////////////////////////////////////////////////////////////////////////

        }
    }

    /**
    * Draws the X axdis at the bottom (the default)
    */
    RGraph.Bar.prototype.Drawlabels_bottom = function ()
    {
        this.context.beginPath();
        this.context.fillStyle = this.Get('chart.text.color');

        if (this.Get('chart.xaxispos') != 'center') {
            
            var interval   = (this.grapharea * (1/5) );
            var text_size  = this.Get('chart.text.size');
            var units_pre  = this.Get('chart.units.pre');
            var units_post = this.Get('chart.units.post');
            var gutter     = this.Get('chart.gutter');
            var context    = this.context;
            var align      = this.Get('chart.yaxispos') == 'left' ? 'right' : 'left';
            var xpos       = this.Get('chart.yaxispos') == 'left' ? gutter - 5 : this.canvas.width - gutter + 5;
            var font       = this.Get('chart.text.font');

            RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight, RGraph.number_format(this.scale[4], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (1*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[3], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (2*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[2], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (3*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[1], units_pre, units_post), null, align);
            RGraph.Text(context, font, text_size, xpos, (4*interval) + gutter + this.halfTextHeight, RGraph.number_format(this.scale[0], units_pre, units_post), null, align);
        }
        
        this.context.fill();
        this.context.stroke();
    }