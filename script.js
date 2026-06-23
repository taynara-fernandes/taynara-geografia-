    <!-- Carregar D3.js e TopoJSON (para converter dados) -->
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>
    <script>
        (function() {
            // --- 1. Configurações e variáveis globais ---
            const width = 960;
            const height = 500;

            // Seletores
            const mapDiv = document.getElementById('map');
            const countryNameSpan = document.getElementById('country-name');

            // --- 2. Criar SVG com projeção geográfica (Mercator) ---
            const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`)
                .style("background", "#1f3a4b")
                .style("border-radius", "20px");

            // Projeção: Mercator com parâmetros ajustados para um bom enquadramento
            const projection = d3.geoMercator()
                .scale(145)
                .translate([width / 2, height / 1.7])   // centraliza verticalmente
                .center([0, 10]);                       // ligeiro ajuste norte

            const pathGenerator = d3.geoPath()
                .projection(projection);

            // --- 3. Carregar dados GeoJSON (World Atlas) ---
            const url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

            d3.json(url).then(worldData => {
                // Converter TopoJSON → GeoJSON
                const countries = topojson.feature(worldData, worldData.objects.countries);
                
                // --- 4. Desenhar os países ---
                svg.selectAll(".country")
                    .data(countries.features)
                    .enter()
                    .append("path")
                    .attr("class", "country")
                    .attr("d", pathGenerator)
                    .attr("data-country", d => d.properties.name || "Desconhecido")
                    // Tooltip nativo (título) 
                    .append("title")
                    .text(d => d.properties.name || "País");

                // --- 5. Interação: clique e hover (com destaque) ---
                // Função para resetar destaque
                function resetActive() {
                    svg.selectAll(".country").classed("active", false);
                    countryNameSpan.textContent = "Clique em um país";
                }

                // Clique: mostra nome e destaca
                svg.selectAll(".country")
                    .on("click", function(event, d) {
                        // Remove destaque de todos
                        svg.selectAll(".country").classed("active", false);
                        // Adiciona destaque ao clicado
                        d3.select(this).classed("active", true);
                        // Atualiza painel
                        const nome = d.properties.name || "País sem nome";
                        countryNameSpan.textContent = nome;
                    })
                    // Hover: já tem efeito via CSS, mas podemos adicionar algo extra
                    .on("mouseover", function(event, d) {
                        // (opcional) podemos mostrar tooltip, mas já temos title nativo
                        // apenas para consistência, não fazemos nada extra.
                    });

                // --- 6. Botão reset ---
                document.getElementById('reset-btn').addEventListener('click', function() {
                    resetActive();
                });

                // --- 7. Inicializar com um país em destaque? (opcional) ---
                // Por padrão, nenhum país selecionado.
                countryNameSpan.textContent = "Clique em um país";

                // --- 8. (Bônus) Ajuste de responsividade: redesenhar se necessário? 
                //     Como usamos viewBox, o SVG se ajusta automaticamente.
                //     Mas podemos adicionar um observer para redimensionar, caso queira.
                //     Neste caso, mantemos fixo.

                console.log("🌍 Mapa carregado com sucesso!");
            }).catch(error => {
                console.error("Erro ao carregar dados do mapa:", error);
                countryNameSpan.textContent = "⚠️ Erro ao carregar mapa";
                // Mostrar mensagem amigável no SVG
                svg.append("text")
                    .attr("x", width/2)
                    .attr("y", height/2)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#f0c0a0")
                    .attr("font-size", "22px")
                    .attr("font-weight", "300")
                    .style("text-shadow", "0 2px 10px #00000088")
                    .text("🌐 Dados não disponíveis");
            });

        })();
    </script>
