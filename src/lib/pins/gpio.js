const pins = {
}

const pinCount = 26

for(let i=1;i<=26;i++){
    pins[`GPIO${i}`]= {
        number: i,
        mode: 'in'
    }
}