$fn=60;

//base_holes_space_x = 46;
//base_holes_space_y = 10;
//base_holes_diam = 3.2;

riser_h = 14;
riser_l_base = 43;
riser_w = 3;
riser_pos = 29;    // Position from the left of the base


// Base, aligned on bottom corner
module base(){
translate([26, 8, 4])
rotate([90, 0, 0])
import("base.stl");
}



module riser(){
    real_l = riser_l_base;

    points = [
        [0, 0],
        [real_l, 0],
        [real_l + riser_h,riser_h],
        [riser_h,riser_h]
    ];

    translate([riser_pos, 0, 0]){
        // Main part
        rotate([90, 0, 90])
        linear_extrude(height=riser_w)
        polygon(points=points, paths=[[0,1,2, 3]]);
        
        // Extension for microswitch
        translate([0, 22, 7])
        cube([riser_w + 0.3, 20, 10]);
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


module holes_lower_arm(){
    color("red")
    translate([riser_pos + 2, 27, 14])
    rotate([-90, 0, 0])
    rotate([0, -90, 0])
    holes();
    
        
}


module holes_higher_arm(){
    color("red"){
    translate([24, 4, 4])
        //rotate([-45, 0, 0])
        //rotate([0, -90, 0])
        holes();

    }
        
}



difference(){
    union(){
        base();
        riser();
        //riser2();
    }
    holes_lower_arm();
    holes_higher_arm();
}