
console.log ("Hello World")

//d3.json("partidos2.json").then(function(datosCompletos) {
d3.json("data.json").then(function(datosCompletos) {

    
    
    // NUEVA VARIABLE CON LA INFO DE PARTIDOS DEL NUEVO DATASET
//    var datosPartidos = datosCompletos.partidos
      var datosCountries = datosCompletos.Countries
    
    
    console.log ("los datos ya se han recibido")
    
    var height = 600
    var width = 400
    
    var margin  = {
        top: 20,
        botton: 50,
        left:40,
        right:50
            
    }
    
    var elementosvg=d3.select ("body")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
    
     
    var escalaX = d3.scaleLinear()
        .domain ([1,10])
        .range ([0 + margin.left, width - margin.right])
    
    
    var escalaY= d3.scaleLinear()
        .domain (d3.extent(datosCountries, d => d.AverageInternationalStudents))
        .range ([height - margin.botton, 0 + margin.top])
    
    // VISUALIZAMOS EJE X
    var ejeX = d3.axisBottom (escalaX)
    
    // PONER TICKS
        .ticks (5)
        .tickFormat (d3.format(".3s"))
    
           
    //Pintar eje X
    elementosvg
        .append("g")
        .attr("transform","translate (0," + (height - margin.botton+5) + ")")
        .call(ejeX)
              
              
    // VISUALIZAMOS EJE Y
    var ejeY = d3.axisLeft (escalaY)
    
    //Pintar eje Y
    elementosvg
        //estas dos líneas antes del .call (ejeY). MUEVEN EL EJE 
        .append("g")
        .attr("transform","translate (" + margin.left + ",0)")

	    .transition()
        .duration (1000)
            
        .ease(d3.easeBackIn)
            //.ease (d3.easeBounce) 
        .delay (500)  //Demora inicio animación
        .call(ejeY)
    
    
    // Hacer la escalaColor que va del red al blue (1,10) y con la variable AverageScore    
    var escalaColor = d3.scaleLinear ()
        .domain ([1, 5, 10])
        .range (["red", "grey", "blue"])
    
     var escala_tamanio = d3.scaleLinear()
        .domain(d3.extent(datosCountries, d => d.AverageInternationalStudents))
        .range([8,20])
         
	console.log (" MENSAJE DE DATOS CONTRIES\n")
        console.log(datosCountries);
	console.log ("\nMENSAJE DE AverageInternationalStudents \n")
	console.log(datosCountries[0].AverageInternationalStudents);
	console.log(datosCountries[0].AverageScore);

    
     
    elementosvg
        .selectAll("circle") 
        .data(datosCountries) 
        .enter()
        .append ("circle")
        .attr("r",d => escala_tamanio(d.AverageInternationalStudents)) 
        .attr ("cx", d => escalaX(d.AverageScore))
        .attr("cy",d => escalaY(d.AverageInternationalStudents))
    
        .attr ("fill", d => escalaColor(d.AverageScore))
   
        //LLAMA A LA FUNCION QUE PINTA LA SEGUNDA GRAFICA
        //.on("click", d => pintarHistograma(d.Country))
        //.on("mouseover", d => pintarHistograma(d.Country))
        .on ("mouseover", d => {
               pintarUniversidad(d.Country)
               pintarTooltip (d)
        })
        .on ("mouseout", borrarTooltip)
        
    //// VAMOS A PINTAR LA GRAFICA DEL HISTOGRAMA
    /////////////////////////////////////////////
    
    //SOLO ES NECESARIO PINTARLA UNA VEZ    
    var svgUniversidad=d3.select ("body")
        .append("svg")     
        .attr("width",width)
        .attr("height",height)
    
    svgUniversidad
        .append("g")
        .attr("transform","translate (0," + (height - margin.botton+5) + ")")
        .call(ejeX)
    
    // CREO UNA g NUEVA. Creo el eje entero nuevo
    var gEjeYUniversidad =  svgUniversidad
            .append("g")
            .attr("transform","translate (" + margin.left + ",0)")
    
    
     var tooltip = d3.select ("body")
        .append("div")
        .attr("class","tooltip")
     
     //BORRAR TOOLTIP
     function borrarTooltip(){
         tooltip    
           // .transition()
            .style("opacity",0)         
     }
    
    //PINTAR TOOLTIP
    function pintarTooltip(d){
        tooltip
            //.text (d.Country)
            .text(d.Country + " /// " + d.AverageScore)
            .style ("top", d3.event.pageY + "px")  // TçE DA LA POSICION DONDE SE HA PRODUCIDO EL EVENTO
            .style ("left", d3.event.pageX + "px")
            // PARA QUE LA APRICION DEL TOOLTIP NO SEA BRUSCA
           //.transition()
            .style("opacity",1)
        
    }
    
    
    
    // FUNCION PARA PINTAR GRAFICA UNIVERSIDAD. RECIBE COMO PARAMETRO EL NOMBRE DEL PARTIDO
    function pintarUniversidad (Countryseleccionado) {
        
    // NUEVA VARIABLE CON LA INFO DE Universidades DEL PARTIDO QUE RECIBE COMO PARAMETRO DE LA FUNCION
     var datosUniversidad = datosCompletos.Universities[Countryseleccionado]

          
     var escalaYUniversidad = d3.scaleLinear()
        .domain (d3.extent(datosUniversidad, d => d.y))
        .range ([height - margin.botton, 0 + margin.top])
     
     var ejeYUniversidad = d3.axisLeft (escalaYUniversidad)
        .ticks (5)
        .tickFormat (d3.format(".3s"))
     
     // Pinta sobre la misma g del eje Y
     //gEjeYHistograma.call(ejeYHistograma) 
        
      gEjeYUniversidad
            .transition ()
            .duration (2000)
            //.ease (d3.easeElastic.period(0.4)) // Veloc.rebote
            .ease(d3.easeBounce)
            //.delay (500)
            .call(ejeYUniversidad)
        
     var escaladelay = d3.scaleLinear()
        .domain ([1,10])
        .range([500,1000])
        
        
    // LA 1ª VEZ AÑADO CIRCULOS LAS SIGUIENTES ACTUALIZO
        
        
    // ACTUALIZAR CIRCULOS SI YA EXISTEN (2ª vez y siguientes)
    // No hay enter ni append
        
        svgUniversities
            .selectAll("circle") 
            .data(datosUniversidad) 
        
        // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
        
        // https://observablehq.com/@d3/easing
        
            .transition()
            .duration (5000)
            .ease (d3.easeElastic.period(0.4)) // Veloc.rebote
            //.ease(d3.easeBackIn)
            //.ease (d3.easeBounce) 
            //.delay (500)  //Demora inicio animación
            .delay (d => d.x*200)
            //.delay (d => escaladelay (d.x))    
        
            .attr("r",d => escala_tamanio(d.y)) 
            .attr ("cx", d => escalaX(d.x))
            .attr("cy",d => escalaYUniversidad(d.y))
            .attr ("fill", d => escalaColor(d.x))
        
    // AÑADO NUEVOS CIRCULOS  
    // PARA CIRCULOS QUE NO EXISTAN (primer click)   
       svgUniversidad
            .selectAll("circle") 
            .data(datosUniversidad) 
            .enter() // Toma los circulos que no existen
            .append ("circle")
            .attr("r",d => escala_tamanio(d.y)) 
            .attr ("cx", d => escalaX(d.x))
            .attr("cy",d => escalaYUniversidad(d.y))
            .attr ("fill", d => escalaColor(d.x))
        
    }
        
        
}
)
