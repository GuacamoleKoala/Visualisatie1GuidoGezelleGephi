function nodeActive(a) {

	var groupByDirection=false;
	if (config.informationPanel.groupByEdgeDirection && config.informationPanel.groupByEdgeDirection==true)	 groupByDirection=true;
	
	sigInst.neighbors = {};
	sigInst.detail = !0;
	var b = sigInst._core.graph.nodesIndex[a];
	showGroups(!1);
	var outgoing={},incoming={},mutual={};//SAH
	sigInst.iterEdges(function (b) {
		b.attr.lineWidth = !1;
		b.hidden = !0;
		
		n={
			name: b.label,
			colour: b.color
		};
		
			if (a==b.source) outgoing[b.target]=n;		//SAH
		else if (a==b.target) incoming[b.source]=n;		//SAH
		if (a == b.source || a == b.target) sigInst.neighbors[a == b.target ? b.source : b.target] = n;
		b.hidden = !1, b.attr.color = "rgba(0, 0, 0, 1)";
	});
	var f = [];
	sigInst.iterNodes(function (a) {
		a.hidden = !0;
		a.attr.lineWidth = !1;
		a.attr.color = a.color
	});
	
	if (groupByDirection) {
		//SAH - Compute intersection for mutual and remove these from incoming/outgoing
		for (e in outgoing) {
			//name=outgoing[e];
			if (e in incoming) {
				mutual[e]=outgoing[e];
				delete incoming[e];
				delete outgoing[e];
			}
		}
	}
	
	var createList=function(c) {
		var f = [];
		var e = [],
				//c = sigInst.neighbors,
				g;
	for (g in c) {
		var d = sigInst._core.graph.nodesIndex[g];
		d.hidden = !1;
		d.attr.lineWidth = !1;
		d.attr.color = c[g].colour;
		a != g && e.push({
			id: g,
			name: d.label,
			group: (c[g].name)? c[g].name:"",
			colour: c[g].colour
		})
	}
	e.sort(function (a, b) {
		var c = a.group.toLowerCase(),
			d = b.group.toLowerCase(),
			e = a.name.toLowerCase(),
			f = b.name.toLowerCase();
		return c != d ? c < d ? -1 : c > d ? 1 : 0 : e < f ? -1 : e > f ? 1 : 0
	});
	d = "";
		for (g in e) {
			c = e[g];
			/*if (c.group != d) {
				d = c.group;
				f.push('<li class="cf" rel="' + c.color + '"><div class=""></div><div class="">' + d + "</div></li>");
			}*/
			f.push('<li class="membership"><a href="#' + c.name + '" onmouseover="sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex[\'' + c.id + '\'])\" onclick=\"nodeActive(\'' + c.id + '\')" onmouseout="sigInst.refresh()">' + c.name + "</a></li>");
		}
		return f;
	}
	
	
	var f=[];
	

	if (groupByDirection) {
		size=Object.size(mutual);
		f.push("<h2>Mututal (" + size + ")</h2>");
		(size>0)? f=f.concat(createList(mutual)) : f.push("No mutual links<br>");
		size=Object.size(incoming);
		f.push("<h2>Incoming (" + size + ")</h2>");
		(size>0)? f=f.concat(createList(incoming)) : f.push("No incoming links<br>");
		size=Object.size(outgoing);
		f.push("<h2>Outgoing (" + size + ")</h2>");
		(size>0)? f=f.concat(createList(outgoing)) : f.push("No outgoing links<br>");
	} else {
		f=f.concat(createList(sigInst.neighbors));
	}
	//b is object of active node -- SAH
	b.hidden = !1;
	b.attr.color = b.color;
	b.attr.lineWidth = 6;
	b.attr.strokeStyle = "#000000";
	sigInst.draw(2, 2, 2, 2);

	$GP.info_link.find("ul").html(f.join(""));
	$GP.info_link.find("li").each(function () {
		var a = $(this),
			b = a.attr("rel");
	});
	f = b.attr;
	if (f.attributes) {
		var image_attribute = false;
		if (config.informationPanel.imageAttribute) {
			image_attribute=config.informationPanel.imageAttribute;
		}
        
        // --- START CUSTOMIZATIONS (Aangepaste attributen weergave) ---
        var e = [];
        var attrs = f.attributes; // Verkorte verwijzing naar attributen

        // Lijst van sleutels die we specifiek behandelen of willen uitsluiten van de generieke 'catch-all' lus
        var excludedKeys = ['Type', 'relatietype', 'SpecificRelatietype', 'richting', 'wikidataLink', 'wikipediaLink', 'commonsLink', 'image', 'bioPortaalLink', 'viafLink'];

        // 1. Display General Type (e.g., Persoon)
        if (attrs.Type && attrs.Type.toLowerCase() !== 'null' && attrs.Type.trim().length > 0) {
            e.push('<span><strong>Type:</strong> ' + attrs.Type + '</span>');
        }

        // 2. Display Relation Type, with deeper specification if applicable
        var mainRelation = attrs.relatietype;
        var specificRelation = attrs.SpecificRelatietype;

        if (mainRelation && mainRelation.toLowerCase() !== 'null' && mainRelation.trim().length > 0) {
            var relationText = mainRelation;
            
            // Controleer op 'relevant persoon' of 'familielid' EN of de specificatie verschilt van de hoofdrelatie of 'Centrale figuur'
            if ((mainRelation === 'relevant persoon' || mainRelation === 'familielid') && 
                specificRelation && 
                specificRelation.toLowerCase() !== 'null' && 
                specificRelation.trim().length > 0 && 
                specificRelation !== mainRelation && 
                specificRelation !== 'Centrale figuur') {
                relationText += ' (' + specificRelation + ')'; // Dit voegt de specificatie tussen haakjes toe
            }
            
            e.push('<span><strong>Relatietype:</strong> ' + relationText + '</span>');
        }

        // 3. Display Richting
        if (attrs.richting && attrs.richting.toLowerCase() !== 'null' && attrs.richting.trim().length > 0) {
            e.push('<span><strong>Richting:</strong> ' + attrs.richting + '</span>');
        }

        // --- Link Attributes (Alle URL's) ---
        var linkAttributes = [
            { key: 'wikidataLink', label: 'Wikidata Link' },
            { key: 'wikipediaLink', label: 'Wikipedia Link' }, // Nu expliciet behandeld
            { key: 'commonsLink', label: 'Wikicommons Link' }, // Nu expliciet behandeld
            { key: 'image', label: 'Afbeelding Link' }, 
            { key: 'viafLink', label: 'VIAF Link' },
            { key: 'bioPortaalLink', label: 'Bioportàal Link' }
        ];

        for (var i = 0; i < linkAttributes.length; i++) {
            var attrConfig = linkAttributes[i];
            var linkKey = attrConfig.key;
            var linkValue = attrs[linkKey];

            // Controle: toon de link ALLEEN als er een geldige waarde is
            if (linkValue && linkValue.toLowerCase() !== 'null' && linkValue.trim().length > 0) {
                // Zorg ervoor dat de link klikbaar is en in een nieuw venster opent
                var h = '<span><strong>' + attrConfig.label + ':</strong> <a href="' + linkValue + '" target="_blank">' + linkValue + '</a></span>';
                e.push(h);
            }
        }
        
        // 4. CATCH-ALL: Toon andere niet-standaard attributen (voor "zoveel mogelijk")
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                // Controleer of de sleutel niet in onze lijst met uitgesloten sleutels staat
                if (excludedKeys.indexOf(key) === -1) {
                    var val = attrs[key];
                    if (val && val.toLowerCase() !== 'null' && val.trim().length > 0) {
                        // Maak de sleutel leesbaar (bijv. "nonstandard_attribute" -> "Nonstandard Attribute")
                        var displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                        e.push('<span><strong>' + displayKey + ':</strong> ' + val + '</span>');
                    }
                }
            }
        }
        // --- END CUSTOMIZATIONS ---
        
		if (image_attribute) {
			//image_index = jQuery.inArray(image_attribute, temp_array);
			$GP.info_name.html("<div><img src=" + f.attributes[image_attribute] + " style=\"vertical-align:middle; max-height:60px; max-width:60px; margin-right: 10px;\" /> <span onmouseover=\"sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex['" + b.id + '\'])" onmouseout="sigInst.refresh()">' + b.label + "</span></div>");
		} else {
			$GP.info_name.html("<div><span onmouseover=\"sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex['" + b.id + '\'])" onmouseout="sigInst.refresh()">' + b.label + "</span></div>");
		}
		// Image field for attribute pane
		$GP.info_data.html(e.join("<br/>"))
	}
	$GP.info_data.show();
	$GP.info_p.html("Connections:");
	$GP.info.animate({width:'show'},350);
	$GP.info_donnees.hide();
	$GP.info_donnees.show();
	sigInst.active = a;
	window.location.hash = b.label;
}
