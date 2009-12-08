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
    
    ModalDialog = {}
    ModalDialog.dialog     = null;
    ModalDialog.background = null;
    ModalDialog.offset     = 50;

    /**
    * Shows the dialog with the supplied DIV acting as the contents
    * 
    * @param string id    The ID of the DIV to use as the dialogs contents
    * @param int    width The width of the dialog
    */
    ModalDialog.Show = function (id, width)
    {
        ModalDialog.id    = id;
        ModalDialog.width = width;

        ModalDialog.ShowBackground();
        ModalDialog.ShowDialog();
        
        // Install the event handlers
        window.onresize = ModalDialog.Resize;
        window.onscroll = 3;

        // Install the event handlers
        window.onresize = ModalDialog.Resize;
        window.onscroll = ModalDialog.Scroll;

        
        // Call them initially
        ModalDialog.Resize()
        ModalDialog.Scroll()
    }
    
    
    /**
    * Shows the background semi-transparent darkened DIV
    */
    ModalDialog.ShowBackground = function ()
    {
        // Create the background if neccessary
        if (!ModalDialog.background) {
            ModalDialog.background = document.createElement('DIV');
            
            ModalDialog.background.style.className       = 'ModalDialog_background';
            ModalDialog.background.style.position        = 'absolute';
            ModalDialog.background.style.top             = 0;
            ModalDialog.background.style.left            = 0;
            ModalDialog.background.style.width           = '1px';
            ModalDialog.background.style.height          = '1px';
            ModalDialog.background.origWidth             = Math.max(1000, document.body.offsetWidth);
            ModalDialog.background.origHeight            = Math.max(1000, document.body.offsetHeight);


            // Accomodate Opera
            if (navigator.userAgent.indexOf('Opera') != -1) {
                ModalDialog.background.style.height = parseInt(document.body.scrollHeight) + 10 + 'px';
            
            } else if (navigator.userAgent.indexOf('MSIE') != -1) {
                ModalDialog.background.style.width = '102%';//(parseInt(document.body.offsetWidth)  - 15) + 'px';
                ModalDialog.background.style.height = parseInt(document.body.scrollHeight) + 20 + 'px';
            }

            ModalDialog.background.style.backgroundColor = '#ccc';
            ModalDialog.background.style.filter = 'Alpha(opacity=50)';
            ModalDialog.background.style.opacity = 0.5;
            ModalDialog.background.style.zIndex          = 97;
            
            document.body.appendChild(ModalDialog.background);
        }

        ModalDialog.background.style.visibility = 'visible';
        ModalDialog.background.style.opacity    = 0;
        
        setTimeout('ModalDialog.background.style.opacity = 0.1', 10);
        setTimeout('ModalDialog.background.style.opacity = 0.2', 20);
        setTimeout('ModalDialog.background.style.opacity = 0.3', 30);
        setTimeout('ModalDialog.background.style.opacity = 0.4', 40);
        setTimeout('ModalDialog.background.style.opacity = 0.5', 50);

        setTimeout('ModalDialog.background.style.filter = "Alpha(opacity=10)"', 10);
        setTimeout('ModalDialog.background.style.filter = "Alpha(opacity=20)"', 20);
        setTimeout('ModalDialog.background.style.filter = "Alpha(opacity=30)"', 30);
        setTimeout('ModalDialog.background.style.filter = "Alpha(opacity=40)"', 40);
        setTimeout('ModalDialog.background.style.filter = "Alpha(opacity=50)"', 50);
    }


    /**
    * Shows the dialog itself
    */
    ModalDialog.ShowDialog = function ()
    {
        // Create the DIV if necessary
        if (!ModalDialog.dialog) {
            ModalDialog.dialog = document.createElement('DIV');
    
            ModalDialog.dialog.id                    = 'ModalDialog_dialog';
            ModalDialog.dialog.className             = 'ModalDialog_dialog';
            ModalDialog.dialog.style.borderRadius    = '5px';
            ModalDialog.dialog.style.MozBorderRadius = '5px';
            ModalDialog.dialog.style.WebkitBorderRadius = '5px';
            ModalDialog.dialog.style.MozBoxShadow = '3px 3px 3px rgba(96,96,96,0.5)';
            ModalDialog.dialog.style.WebkitBoxShadow    = 'rgba(96,96,96,0.5) 3px 3px 3px';
            ModalDialog.dialog.style.position        = 'absolute';
            ModalDialog.dialog.style.backgroundColor = 'white';
            ModalDialog.dialog.style.width           = parseInt(ModalDialog.width) + 'px';
            ModalDialog.dialog.style.border          = '2px solid #999';
            ModalDialog.dialog.style.zIndex          = 99;
            ModalDialog.dialog.style.backgroundColor = '#fff';
            ModalDialog.dialog.style.padding         = '5px';
            ModalDialog.dialog.style.paddingTop      = '25px';
            ModalDialog.dialog.style.overflow      = 'hidden';
            ModalDialog.dialog.innerHTML             = document.getElementById(ModalDialog.id).innerHTML;


            // Accomodate various browsers
            if (navigator.userAgent.indexOf('Opera') != -1) {
                ModalDialog.dialog.style.paddingTop = '25px';

            } else if (navigator.userAgent.indexOf('MSIE') != -1) {
                ModalDialog.dialog.style.paddingTop = '25px';

            } else if (navigator.userAgent.indexOf('Safari') != -1) {
                ModalDialog.dialog.style.paddingTop = '25px';
            }

            document.body.appendChild(ModalDialog.dialog);
            
            // Now create the grey bar at the top of the dialog
            var bar = document.createElement('DIV');
            bar.style.top = 0;
            bar.style.left = 0;
            bar.style.width = (ModalDialog.dialog.offsetWidth - 4) + 'px';
            bar.style.height = '20px';
            bar.style.backgroundColor = '#bbb';
            bar.style.borderBottom = '2px solid #999';
            bar.style.zIndex    = -99;
            bar.style.MozBorderRadiusTopright = '2px';
            bar.style.MozBorderRadiusTopleft = '2px';
            bar.style.WebkitBorderTopleftRadius = '2px';
            bar.style.WebkitBorderToprightRadius = '2px';
            bar.style.position = 'absolute';

            ModalDialog.dialog.insertBefore(bar, null);
            
            // Now reposition it in the center
            ModalDialog.dialog.style.left = (document.body.offsetWidth / 2) - (ModalDialog.dialog.offsetWidth / 2) + 'px';
            ModalDialog.dialog.style.top  = (document.body.scrollTop + ModalDialog.offset) + 'px';
        }
        
        // Show the dialog
        ModalDialog.dialog.style.visibility = 'visible';
        ModalDialog.dialog.style.opacity    = 0;
        
        // A simple fade-in effect
        setTimeout('ModalDialog.dialog.style.opacity = 0.2', 10);
        setTimeout('ModalDialog.dialog.style.opacity = 0.4', 20);
        setTimeout('ModalDialog.dialog.style.opacity = 0.6', 30);
        setTimeout('ModalDialog.dialog.style.opacity = 0.8', 40);
        setTimeout('ModalDialog.dialog.style.opacity = 1', 50);

        setTimeout('ModalDialog.dialog.style.filter = "Alpha(opacity=20)"', 10);
        setTimeout('ModalDialog.dialog.style.filter = "Alpha(opacity=40)"', 20);
        setTimeout('ModalDialog.dialog.style.filter = "Alpha(opacity=60)"', 30);
        setTimeout('ModalDialog.dialog.style.filter = "Alpha(opacity=80)"', 40);
        setTimeout('ModalDialog.dialog.style.filter = "Alpha(opacity=100)"', 50);
    }

    
    /**
    * Hides everything
    */
    ModalDialog.Close = function ()
    {
        if (ModalDialog.background) ModalDialog.background.style.visibility = 'hidden';
        if (ModalDialog.dialog)     ModalDialog.dialog.style.visibility     = 'hidden';
    }
    
    // An alias
    ModalDialog.Hide = ModalDialog.Close
    
    
    /**
    * Accommodate the window being resized
    */
    ModalDialog.Resize = function ()
    {
        if (ModalDialog.dialog)     ModalDialog.dialog.style.left = (document.body.offsetWidth / 2) - (ModalDialog.dialog.offsetWidth / 2) + 'px';


        // Opera
        if (navigator.userAgent.indexOf('Opera') != -1) {
            ModalDialog.background.style.height = Math.max(parseInt(document.body.scrollHeight) + 25, parseInt(document.body.parentNode.clientHeight)) + 10 + 'px';
            ModalDialog.background.style.width = Math.max(parseInt(document.body.scrollWidth) + 25, parseInt(document.body.parentNode.clientWidth)) + 10 + 'px';

        // MSIE
        } else if (navigator.userAgent.indexOf('MSIE') != -1) {
            ModalDialog.background.style.height = parseInt(document.body.scrollHeight) + 10 + 'px';
        
        // Firefox
        } else if (navigator.userAgent.indexOf('Firefox') != -1) {
            ModalDialog.background.style.width  = Math.max(screen.width, document.body.offsetWidth + 25) + 'px';
            ModalDialog.background.style.height = Math.max(screen.height, document.body.offsetHeight + 35) + 'px';
        
        // Chrome
        } else if (navigator.userAgent.indexOf('Chrome') != -1) {
            ModalDialog.background.style.width  = Math.max(screen.width, document.body.offsetWidth + 25) + 'px';
            ModalDialog.background.style.height = Math.max(screen.height, document.body.offsetHeight + 30) + 'px';

        // Safari
        } else if (navigator.userAgent.indexOf('Safari') != -1) {
            ModalDialog.background.style.width  = Math.max(screen.width, document.body.offsetWidth + 25) + 'px';
            ModalDialog.background.style.height = Math.max(screen.height, document.body.offsetHeight + 30) + 'px';
        }
    }
    
    
    /**
    * Handle the scroll event
    */
    ModalDialog.Scroll = function ()
    {
        if (ModalDialog.dialog) ModalDialog.dialog.style.top = (document.body.scrollTop || window.pageYOffset)+ ModalDialog.offset + 'px';
    }