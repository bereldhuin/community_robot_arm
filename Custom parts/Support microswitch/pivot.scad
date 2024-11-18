$fn=60;

base_screw_spacing = 31;
base_screw_diam = 3.2;
base_h = 3;
base_w = 11;
base_l = base_screw_spacing + base_screw_diam + 3;

riser_w = 3;
riser_h = 30;
riser_l = 12; // base width * square(2)

module base(){
    difference(){
    
        cube([base_l, base_w, base_h ]);
        base_holes();
    }
}

module base_holes(){
    translate([1.5 + base_screw_diam / 2, base_w - 5, -0.01]){
        cylinder(d = base_screw_diam, h=base_h + 1);
        translate([base_screw_spacing, 0, 0])
        cylinder(d = base_screw_diam, h=base_h + 1);
    }
}

module riser(){
    translate([base_l - 16, 2, 0])
    rotate([0, 0, -45]){
    
        difference(){       
            cube([riser_w, riser_l, riser_h]);

            translate([0, riser_l / 2 , riser_h - 5 - 9.5])
            rotate([0, -90, 0])
            holes();
        }
    }
}

module holes(){
    
    // align top of holes to the begining of screw head
    
    translate([0, 0, -5]){
        // Main holes
        cylinder(d=2.6, h=10);
        translate([9.5, 0, 0])
        cylinder(d=2.6, h=10);
        
        // Screw heads holes
        translate([0, 0, 5])
        cylinder(d=4, h=5);
        
        translate([9.5, 0, 5])
        cylinder(d=4, h=5);
    }    
}

base();
riser();