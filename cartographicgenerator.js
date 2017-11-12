"use strict"

function CarthographicGenerator()
{
    
    this.generateToTexture = function(noiseData, thresholds, colors, img, w, h)
    {
        let values = new Array(noiseData.length);

        let colorRgbs = [];
        for(let i  =0; i < colors.length; i++)
        {
            colorRgbs.push(hexToRgb(colors[i]));
        }

        for(let i =0 ; i < w ; i++)
        {
            for(let j =0 ; j < h ; j++)
            {
                let noise = noiseData[ i*h +j];
                let getPixel = ( v) =>
                {
                    let pixel = colorRgbs[0];
                    
                    for(let k = thresholds.length - 1; k >= 0; k--)
                    {
                        let t = thresholds[k];
    
                        if(v >= t)
                        {
                            pixel = colorRgbs[k+1];
                            break;
                        }               
                    }
                    v = v*1.5 + 0.25; // Add a gain
                    v = v > 1.0 ? 1.0 : v;

                    return {r: pixel.r * v, g: pixel.g * v, b: pixel.b * v};
                }
                
                let pixel = getPixel( noise);

                // v = v*1.5 + 0.25; // Add a gain
                // v = v > 1.0 ? 1.0 : v;

                // let r = noise * 255;
                // let g = noise * 255;
                // let b = noise * 255;
                // pixel.r = noise * 255;
                // pixel.g = noise * 255;
                // pixel.b = noise * 255;

                img.data[i*h*4 + j*4 + 0] = pixel.r;
                img.data[i*h*4 + j*4 + 1] = pixel.g;
                img.data[i*h*4 + j*4 + 2] = pixel.b;
                img.data[i*h*4 + j*4 + 3] = 255;

                // let pos = getSphereCoordinate((i / w), (j / h));
                // img.data[i*h*4 + j*4 + 0] = pos.x * 255;
                // img.data[i*h*4 + j*4 + 1] = pos.y * 255;
                // img.data[i*h*4 + j*4 + 2] = pos.z * 255;
                // img.data[i*h*4 + j*4 + 3] = 255;
                
            }
        }

    }
}