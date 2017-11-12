"use strict";

function generateSphereMesh(resolution)
{
    let sphere = {vertices: [], 
                   elements: []};

    const radius = 0.5;

    let X1,Y1,X2,Y2,Z1,Z2;
    let w1,w2,h1, h2, R1, R2;
    let u1, u2, v1, v2;

    let stacks = resolution;
    let slices = resolution;

    // sphere.vertices.reserve(stacks*slices*12);
    // sphere.vertices.reserve(stacks*slices*6);

    let nextId = 0;

    let halfSlices = slices*0.5;

    for(let w = 0; w < stacks; w++)
    {
        for(let h = (-halfSlices); h < halfSlices; h++)
        {
            // w1 = (w/(float) slices)*2*M_PI;
            // w2 = ((w+1)/(float) slices)*2*M_PI;

            // h1 = (h/(float) stacks)*M_PI;
            // h2 = ((h+1)/(float) stacks)*M_PI;
            
            

            w1 = (w/ slices) * 2 * Math.PI;
            w2 = ((w+1)/ slices) * 2 * Math.PI;

            u1 = w / stacks;
            u2 = (w+1) / stacks;

            v1 = ((h)/ halfSlices + 1) * 0.5;
            v2 = ((h +1 ) / halfSlices + 1) * 0.5;

            h1 = (h/ stacks) * Math.PI;
            h2 = ((h+1) / stacks)* Math.PI;

            X1 = Math.sin(w1);
            Y1 = Math.cos(w1);
            X2 = Math.sin(w2);
            Y2 = Math.cos(w2);

            R1 = Math.cos(h1);
            R2 = Math.cos(h2);
            // R1 = radius;
            // R2 = radius;

            Z1 = radius * Math.sin(h1);
            Z2 = radius * Math.sin(h2);

            
            sphere.vertices.push(R1*X1*radius, Z1, R1*Y1*radius); // vertex
            sphere.vertices.push(R1*X1*radius, Z1, R1*Y1*radius); // normal
            sphere.vertices.push(u1, v1); // texcoord
            sphere.elements.push(nextId);
            nextId++; // 0
            // sphere.vertices.push_back({glm::vec3(R1*X1*radius, Z1, R1*Y1*radius), glm::vec3(R1*X1*radius, Z1, R1*Y1*radius)});
            // sphere.elements.push_back(nextId++); // 0

            sphere.vertices.push(R1*X2*radius, Z1, R1*Y2*radius); // vertex
            sphere.vertices.push(R1*X2*radius, Z1, R1*Y2*radius); // normal
            sphere.vertices.push(u2, v1); // texcoord
            sphere.elements.push(nextId);
            nextId++; // 1
            // sphere.vertices.push_back({glm::vec3(R1*X2*radius, Z1, R1*Y2*radius), glm::vec3(R1*X2*radius, Z1, R1*Y2*radius)});
            // sphere.elements.push_back(nextId++); // 1

            sphere.vertices.push(R2*X2*radius, Z2, R2*Y2*radius); // vertex
            sphere.vertices.push(R2*X2*radius, Z2, R2*Y2*radius); // normal
            sphere.vertices.push(u2, v2); // texcoord
            sphere.elements.push(nextId);
            nextId++; // 2
            // sphere.vertices.push_back({glm::vec3(R2*X2*radius, Z2, R2*Y2*radius), glm::vec3(R2*X2*radius, Z2, R2*Y2*radius)});
            // sphere.elements.push_back(nextId++); // 2

            sphere.elements.push(sphere.elements[sphere.elements.length-3]);
            sphere.elements.push(sphere.elements[sphere.elements.length-2]);
            // sphere.elements.push_back(sphere.elements[sphere.elements.size()-3]); // 0
            // sphere.elements.push_back(sphere.elements[sphere.elements.size()-2]); // 2

            sphere.vertices.push(R2*X1*radius, Z2, R2*Y1*radius); // vertex
            sphere.vertices.push(R2*X1*radius, Z2, R2*Y1*radius); // normal
            sphere.vertices.push(u1, v2); // texcoord
            sphere.elements.push(nextId);
            nextId++; 
            // sphere.vertices.push_back({glm::vec3(R2*X1*radius, Z2, R2*Y1*radius), glm::vec3(R2*X1*radius, Z2, R2*Y1*radius)}); // 3
            // sphere.elements.push_back(nextId++);

        }

    }

    return sphere;



}