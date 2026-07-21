// ============================================================
//  CONTEÚDO DO SISTEMA — edite aqui para mudar textos, nome,
//  descrição, contato e categorias em toda a aplicação.
// ============================================================

// --- Marca ---------------------------------------------------
export const brand = {
  name: '3D Ateliê',
  tagline: 'Impressões',
  description: 'Impressão 3D sob demanda',
  fullDescription:
    'Peças exclusivas impressas em 3D, direto do estúdio para você. Design, qualidade e personalização em cada camada.',
  fullDescriptionHighlight: 'direto do estúdio para você',
}

// --- Contato -------------------------------------------------
export const contact = {
  whatsapp: '5548998118661',          // Número completo (DDI+DDD+número), sem espaços ou traços
  whatsappDisplay: '(48) 99811-8661', // Como o número aparece na tela
  instagram: 'https://instagram.com/3dstudio',  // URL completa do perfil
  instagramHandle: '@3dstudio',       // Como aparece na tela
  email: 'contato@3dstudio.com.br',  // E-mail de contato
}

// --- Página inicial ------------------------------------------
export const home = {
  hero: {
    cta: 'Ver Produtos',
    whatsappCta: 'Fale pelo WhatsApp',
    stats: [
      { value: '100%', label: 'Personalizado' },
      { value: 'PLA',  label: 'Alta Qualidade' },
      { value: '48h',  label: 'Entrega Rápida'  },
    ],
  },
  products: {
    sectionTitle: 'Nossos Produtos',
    sectionSubtitle: 'Cada peça é impressa sob demanda com máxima qualidade',
  },
  footer: {
    copyright: `${''} Todos os direitos reservados.`, // prefixo "© ano marca" é gerado automaticamente
  },
}

// --- Header --------------------------------------------------
export const header = {
  cartButton: 'Carrinho',
  cartAriaLabel: (n) => `Carrinho com ${n} itens`,
  tagline: 'Impressão 3D sob demanda',
  navLinks: [
    { label: 'Produtos',    href: '#produtos',    type: 'anchor' },
    { label: 'Depoimentos', href: '/depoimentos',  type: 'route'  },
    { label: 'Sobre',       href: '/sobre',       type: 'route'  },
    { label: 'FAQ',         href: '/faq',         type: 'route'  },
  ],
}

// --- Carrinho ------------------------------------------------
export const cart = {
  title: 'Seu Carrinho',
  empty: 'Seu carrinho está vazio',
  emptySubtitle: 'Adicione produtos para continuar',
  viewProducts: 'Ver produtos',
  total: 'Total',
  checkout: 'Finalizar pelo WhatsApp',
  checkoutHint: 'Você será redirecionado para o WhatsApp para confirmar o pedido',
  whatsappMessage: {
    greeting: 'Olá! Gostaria de fazer um pedido:',
    itemsHeader: '*Itens do pedido:*',
    paymentQuestion: 'Poderia me informar sobre formas de pagamento e prazo de entrega?',
    totalPrefix: '*Total:',
  },
}

// --- Produtos (vitrine) -------------------------------------
export const products = {
  categories: ['Todos', 'Decoração', 'Miniaturas', 'Utilidades', 'Arte', 'Personalizado', 'Outro'],
  variationLabels: {
    cor: 'Cor',
    tamanho: 'Tamanho',
    material: 'Material',
  },
  outOfStock: 'Esgotado',
  addToCart: 'Adicionar ao carrinho',
  added: 'Adicionado!',
}

// --- Grade de produtos --------------------------------------
export const productGrid = {
  searchPlaceholder: 'Buscar produtos...',
  clearSearch: 'Limpar busca',
  clearFilters: 'Limpar filtros',
  notFound: 'Nenhum produto encontrado',
  notFoundHint: 'Tente ajustar sua busca ou selecionar outra categoria.',
  retryButton: 'Tentar novamente',
  loadError: 'Falha ao carregar produtos.',
}

// --- Carrossel -----------------------------------------------
export const carousel = {
  sectionTitle: 'Destaques',
  prevLabel: 'Anterior',
  nextLabel: 'Próximo',
  dotLabel: (i) => `Ir para produto ${i + 1}`,
}

// --- Sobre (Quem somos) -------------------------------------
export const sobre = {
  sectionTitle: 'Sobre o Ateliê',
  sectionSubtitle: 'Conheça quem está por trás de cada peça',
  identity: {
    heading: 'Criado com paixão pela impressão 3D',
    paragraphs: [
      'O 3D Ateliê nasceu da vontade de transformar ideias em objetos reais. Trabalhamos com impressão 3D FDM de alta resolução, produzindo peças sob demanda para clientes em todo o Brasil.',
      'Cada projeto é tratado de forma única: do briefing à entrega, acompanhamos cada etapa para garantir que o resultado supere as expectativas.',
    ],
    stats: [
      { value: '200+', label: 'Peças entregues' },
      { value: '3+',   label: 'Anos de experiência' },
      { value: '48h',  label: 'Prazo de produção' },
    ],
    cta: 'Fale pelo WhatsApp',
  },
  process: {
    heading: 'Como funciona',
    steps: [
      { title: 'Você escolhe', description: 'Selecione um produto pronto ou envie sua ideia personalizada pelo WhatsApp.' },
      { title: 'Preparamos o arquivo', description: 'Ajustamos o modelo 3D para garantir a melhor impressão possível.' },
      { title: 'Imprimimos', description: 'Utilizamos impressoras calibradas com filamentos de alta qualidade.' },
      { title: 'Enviamos', description: 'Embalamos com cuidado e despachamos com rastreamento em até 48h.' },
    ],
  },
  materials: {
    heading: 'Materiais utilizados',
    items: [
      { name: 'PLA', description: 'Biodegradável, ideal para decoração e miniaturas' },
      { name: 'PETG', description: 'Resistente e flexível, ótimo para peças funcionais' },
    ],
  },
}

// --- Depoimentos --------------------------------------------
export const depoimentos = {
  sectionTitle: 'O que nossos clientes dizem',
  sectionSubtitle: 'Avaliações reais de quem já recebeu uma peça do ateliê',
  items: [
    { name: 'Ana Paula S.',   initials: 'AP', stars: 5, text: 'Encomendei uma miniatura personalizada e ficou perfeita! O acabamento é impecável e chegou bem antes do prazo.' },
    { name: 'Carlos Mendes', initials: 'CM', stars: 5, text: 'Ótimo atendimento pelo WhatsApp, super rápidos. A peça para minha impressora 3D caseira encaixou perfeitamente.' },
    { name: 'Renata Lima',   initials: 'RL', stars: 5, text: 'Presentes personalizados para minha família. Todo mundo amou! Voltarei com certeza para o Natal.' },
    { name: 'Felipe Duarte', initials: 'FD', stars: 4, text: 'Produto de qualidade e embalagem muito bem feita. Recomendo para quem procura algo diferente.' },
    { name: 'Mariana Costa', initials: 'MC', stars: 5, text: 'Comprei uma peça decorativa e superou minhas expectativas. Material excelente e entrega rápida.' },
    { name: 'João Victor T.', initials: 'JV', stars: 5, text: 'Encomendei uma placa personalizada para escritório. Ficou lindo e profissional. Valeu cada centavo!' },
  ],
}

// --- FAQ ----------------------------------------------------
export const faq = {
  sectionTitle: 'Perguntas Frequentes',
  sectionSubtitle: 'Tudo o que você precisa saber antes de fazer seu pedido',
  items: [
    { question: 'Vocês aceitam encomendas personalizadas?', answer: 'Sim! Podemos imprimir qualquer modelo 3D que você enviar. Entre em contato pelo WhatsApp com seu arquivo .STL ou descreva o que você precisa.' },
    { question: 'Qual é o prazo de entrega?', answer: 'O prazo de produção é de até 48 horas após a confirmação do pedido. A entrega varia conforme sua localidade, mas enviamos com rastreamento por Correios ou transportadora.' },
    { question: 'Quais materiais estão disponíveis?', answer: 'Trabalhamos com PLA, PETG, ABS e Silk PLA. Cada material tem características diferentes de resistência e acabamento. Podemos te ajudar a escolher o melhor para sua peça.' },
    { question: 'Como funciona o pagamento?', answer: 'Aceitamos Pix, cartão de crédito/débito e transferência bancária. Os detalhes são combinados diretamente pelo WhatsApp após a confirmação do pedido.' },
    { question: 'Posso pedir uma amostra antes de fazer um pedido maior?', answer: 'Sim, oferecemos a opção de pedidos menores para validação de qualidade. Fale conosco pelo WhatsApp para combinarmos.' },
    { question: 'As peças são resistentes? Posso usar em ambientes externos?', answer: 'Depende do material escolhido. O PETG e o ABS têm melhor resistência ao calor e umidade. Para uso externo, recomendamos ABS com acabamento adicional.' },
  ],
}

// --- Painel administrativo ----------------------------------
export const admin = {
  panel: 'Painel Administrativo',
  panelShort: 'Painel Admin',

  login: {
    title: 'Entrar',
    usernameLabel: 'Usuário',
    usernamePlaceholder: 'Nome de usuário',
    passwordLabel: 'Senha',
    passwordPlaceholder: '••••••••',
    submitIdle: 'Entrar',
    submitLoading: 'Entrando...',
    backToStore: '← Voltar à loja',
  },

  header: {
    viewStore: 'Ver loja',
    logout: 'Sair',
  },

  tabs: {
    products: 'Produtos',
  },

  productForm: {
    titleCreate: 'Novo Produto',
    titleEdit: 'Editar Produto',
    nameLabel: 'Nome',
    namePlaceholder: 'Nome do produto',
    descriptionLabel: 'Descrição',
    descriptionPlaceholder: 'Descrição do produto...',
    priceLabel: 'Preço (R$)',
    categoryLabel: 'Categoria',
    stockLabel: 'Estoque',
    activeLabel: 'Ativo',
    inactiveLabel: 'Inativo',
    variationsLabel: 'Variações',
    addVariation: 'Adicionar variação',
    variationPlaceholder: 'Ex: Azul, P, PLA...',
    imagesLabel: 'Imagens',
    uploadHint: 'Clique para selecionar imagens (máx. 5)',
    primaryBadge: 'Principal',
    newBadge: 'Nova',
    cancelButton: 'Cancelar',
    saveButton: 'Salvar Alterações',
    createButton: 'Criar Produto',
    savingButton: 'Salvando...',
  },

  productList: {
    newProduct: 'Novo Produto',
    firstProduct: 'Criar primeiro produto',
    empty: 'Nenhum produto cadastrado.',
    stockLabel: 'Estoque',
    statusActive: 'Ativo',
    statusInactive: 'Inativo',
    statusOutOfStock: 'Esgotado',
    confirmDelete: 'Tem certeza que deseja remover este produto?',
  },

  // Tipos de variação disponíveis no formulário
  variationTypes: [
    { value: 'cor',      label: 'Cor' },
    { value: 'tamanho',  label: 'Tamanho' },
    { value: 'material', label: 'Material' },
  ],

  // Categorias disponíveis no formulário
  categories: ['Decoração', 'Miniaturas', 'Utilidades', 'Arte', 'Personalizado', 'Outro'],
}
