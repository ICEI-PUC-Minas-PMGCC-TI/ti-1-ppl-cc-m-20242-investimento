// Get the current URL's query parameters
const queryParams = window.location.search;

// List of link IDs to update
const links = [
    { id: 'linkInicio', base: '/modulos/acoes/acoes.html' },
    { id: 'linkGuia', base: '#' },
    { id: 'linkPesquisa', base: '/modulos/artigo/painelArtigo.html' },
    { id: 'linkEntradas', base: '/modulos/entradas/entradas.html' },
    { id: 'linkAjuda', base: 'portalDuvidas.html' },
    { id: 'linkSobre', base: 'about.html' },
    { id: 'linkNovoArtigo', base: 'cadastroArtigo.html'}
];

// Update each link's href attribute
links.forEach(link => {
    const element = document.getElementById(link.id);
    if (element && link.base !== '#') {
        element.href = link.base + queryParams;
    }
});