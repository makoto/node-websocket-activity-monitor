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
    * The donut constructor
    * 
    * @param id string The id of the canvas to use
    */
    RGraph.Donut = function (id)
    {
        this.id         = id;
        this.canvas     = document.getElementById(id);
        this.context    = this.canvas.getContext('2d');
        this.type       = 'donut';
        this.data       = [];
        this.pies       = [];
        this.properties = [];


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);

        
        for (i=1; i<arguments.length; ++i) {
            this.data[i - 1] = RGraph.array_clone(arguments[i]);
        }

        // Go through each data set creating a Pie for it
        for (var i=0; i<this.data.length; ++i) {
            this.pies[i] = new RGraph.Pie(id, this.data[i]);
            this.pies[i].Set('chart.isdonut', true);
            
        }

        /**
        * Set some defaults. Set them after all the Pie objects have been created so they're applied to all of them,
        * plus it means they can be changed
        */
        this.Set('chart.key.position', 'graph');
        this.Set('chart.key.shadow', null);
        this.Set('chart.key.background', 'white');
        this.Set('chart.zoom.factor', 1.5);
        this.Set('chart.zoom.fade.in', true);
        this.Set('chart.zoom.fade.out', true);
        this.Set('chart.zoom.hdir', 'right');
        this.Set('chart.zoom.vdir', 'down');
        this.Set('chart.zoom.frames', 10);
        this.Set('chart.zoom.delay', 50);
        this.Set('chart.zoom.shadow', true);
        this.Set('chart.zoom.mode', 'canvas');
        this.Set('chart.zoom.thumbnail.width', 75);
        this.Set('chart.zoom.thumbnail.height', 75);
    }


    /**
    * The accessor
    * 
    * @param string name  Name of the property to set
    * @param string value Value of the property
    */
    RGraph.Donut.prototype.Set = function (name, value)
    {
        // Set the property on this object
        this.properties[name] = value;

        // Also set the property on all pie objects
        for (var i=0; i<this.pies.length; ++i) {
            this.pies[i].Set(name, value);
        }
    }


    /**
    * The accessor
    * 
    * @param string name  Name of the property to get
    */
    RGraph.Donut.prototype.Get = function (name)
    {
        return this.pies[0].properties[name];
    }


    /**
    * The Draw() method
    */
    RGraph.Donut.prototype.Draw = function ()
    {
        /**
        * Check for multiple datasets and tooltips - and warn the user that that combo isn't supported
        */
        if (this.data.length > 1 && this.Get('chart.tooltips') && this.Get('chart.tooltips').length) {
            alert('[DONUT] Sorry, multiple datasets combined with tooltips is not supported!');
        }

        // Turn off all labels except the initial pie chart
        for (var i=1; i<this.pies.length; ++i) {
            this.pies[i].Set('chart.labels', null);
        }

        // The hole width
        var wi = this.canvas.width - (2 * this.Get('chart.gutter'));
        var hi = this.canvas.height - (2 * this.Get('chart.gutter'));
        var di = (Math.min(wi, hi));
        var ra = di / 2;
        var hw = ra / 2;
        var rw = hw / this.pies.length;

        var i = 0;
        var j = this.pies.length;

        for (null; i<this.pies.length; null) {

            i = Number(i);
            j = Number(j);
            var w = hw + (j * rw);

            this.pies[i].Set('chart.radius', w);

            /**
            * Set the centerx
            */
            if (i >= 1) {
                this.pies[i].centerx = this.pies[0].centerx;
                this.pies[i].centery = this.pies[0].centery;
            }

            this.pies[i].Draw();
            
            i++;
            j--;
        }
        
        /**
        * Redraw the hole
        */
        RGraph.NoShadow(this)
        this.context.beginPath();
        this.context.arc(this.pies[0].centerx, this.pies[0].centery, hw, 0, 6.28, 0);
        this.context.stroke();
        this.context.fill();
        
        RGraph.ReplayAnnotations(this);
    }