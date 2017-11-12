"use strict";

function PerlinNoise()
{
    let self = this;
    let seed = 
    {
        persistence: 0.5,
        offsetx : 0,
        offsety : 0,
        scalex : 0.05,
        scaley : 0.05
    }

    function noise2D(x, y)
    {
        // 8161 is the 1024nth prime, 1024 x 1024 is the limit for our texture.
        // This number will "guarantee" no repetition for our (x,y)
        // nth prime reference: https://primes.utm.edu/nthprime/index.php#nth
        let n = x * 8161 + y;
        n = (n<<5) ^ n;
        return ( 1.0 - parseFloat((((n * (n * n * 3 + 48611) + 23) & 0x7fffffff) / 38609.0)));
    }

    function noise3D(x, y, z)
    {
        // 8161 is the 1024nth prime, 1024 x 1024 is the limit for our texture.
        // This number will "guarantee" no repetition for our (x,y)
        // nth prime reference: https://primes.utm.edu/nthprime/index.php#nth
        let n = x * 3671 + y * 8161 + z;
        n = (n<<5) ^ n;
        return ( 1.0 - parseFloat((((n * (n * n * 3 + 48611) + 23) & 0x7fffffff) / 38609.0)));
    }

    function smoothNoise(x, y, z)
    {
        let sides = noise3D(x, y + 1, z) + noise3D(x + 1, y, z) + noise3D(x - 1, y, z) + noise3D(x, y -1, z) +
                    noise3D(x, y , z + 1) + noise3D(x, y , z - 1);
        let center = noise3D(x, y, z);

        return center / 3  + (sides * 2) / 3;
    }

    function interpolate(x, y, a)
    {
        return x*(1-a) + y*a;
    }

    function interpolatedNoise(x, y, z)
    {
        let fractional_X = x - Math.floor(x);
        let fractional_Y = y - Math.floor(y);
        let fractional_Z = z - Math.floor(z);

        let v1 = smoothNoise(parseInt(Math.floor(x)), parseInt(Math.floor(y)), parseInt(Math.floor(z)));
        let v2 = smoothNoise(parseInt(Math.floor(x))+ 1,  parseInt(Math.floor(y)), parseInt(Math.floor(z)));
        let v3 = smoothNoise(parseInt(Math.floor(x)), parseInt(Math.floor(y)) + 1, parseInt(Math.floor(z)));
        let v4 = smoothNoise(parseInt(Math.floor(x)) + 1, parseInt(Math.floor(y)) + 1, parseInt(Math.floor(z)));

        let v5 = smoothNoise(parseInt(Math.floor(x)), parseInt(Math.floor(y)), parseInt(Math.floor(z)+ 1));
        let v6 = smoothNoise(parseInt(Math.floor(x))+ 1,  parseInt(Math.floor(y)), parseInt(Math.floor(z)+ 1));
        let v7 = smoothNoise(parseInt(Math.floor(x)), parseInt(Math.floor(y)) + 1, parseInt(Math.floor(z)+ 1));
        let v8 = smoothNoise(parseInt(Math.floor(x)) + 1, parseInt(Math.floor(y)) + 1, parseInt(Math.floor(z)+ 1));

        let i1 = interpolate(v1, v2, fractional_X);
        let i2 = interpolate(v3, v4, fractional_X);

        let i3 = interpolate(v5, v6, fractional_X);
        let i4 = interpolate(v7, v8, fractional_X);

        let i5 = interpolate(i1 , i2 , fractional_Y);
        let i6 = interpolate(i3 , i4 , fractional_Y);
        return interpolate(i5 , i6 , fractional_Z);
        // return i5;
    }

    function getOctave(x, y, z, frequency, amplitude)
    {
        return interpolatedNoise(x * frequency, y * frequency, z * frequency) * amplitude;
    }

    this.getNoiseData = function(w, h, setAlpha, seed, octaves)
    {
        let allValues = new Array(w*h);
        let max = 0.0;
        let min = 0.0;

        let octavesParams = [];

        for(let i = 0; i < octaves.length; i++)
        {
            let frequency =  Math.pow(2, octaves[i]);
            let amplitude = Math.pow(seed.persistence, octaves[i]+1);
            octavesParams.push({frequency: frequency, amplitude: amplitude});
        }

        let iw = 1 / w ;
        let ih = 1 / h;
        for(let i =0 ; i < w; i++)
        {
            for(let j =0; j < h ; j++)
            {
                let v = 0.0;
                for(let k = 0; k < octavesParams.length; k++)
                {    
                    let octave = octavesParams[k];

                    let pos = getSphereCoordinate(i * iw, j * ih);

                    let x = (pos.x+1) * 0.5 * w ;
                    let y = (pos.y+1) * 0.5 * h ;
                    let z = (pos.z+1) * 0.5 * h ;
                    v += getOctave((x + seed.offsety) * seed.scalex, 
                                    (y + seed.offsetx) * seed.scaley,
                                    (z + seed.offsetx) * seed.scaley, 
                                    octave.frequency, octave.amplitude);
                }
                allValues[i*h+j] = v;
                if(v > max)
                {
                    max  = v;
                }
                if(v < min)
                {
                    min = v;
                }
            }
        }

        for(let i =0; i < allValues.length; i++)
        {
            let v = allValues[i];
            v -= min;
            v /= (max - min);
            allValues[i] = v;
        }
        return allValues;
    }

    this.getNoiseTexture = function(img, w, h, setAlpha, seed, octaves)
    {
        let allValues = self.getNoiseData(w, h, setAlpha, seed, octaves);
        for(let i =0 ; i < w ; i++)
        {
            for(let j =0 ; j < h ; j++)
            {
                let v = allValues[ i*h +j];
                
                let pixel = v*255.0;
                img.data[i*h*4 + j*4 + 0] = pixel;
                img.data[i*h*4 + j*4 + 1] = pixel;
                img.data[i*h*4 + j*4 + 2] = pixel;
                img.data[i*h*4 + j*4 + 3] = setAlpha ? pixel : 255.0;
            }
        }
    }

    this.getSphericalNoise
    
}