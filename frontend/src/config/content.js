// ============================================================
//  CONTEÚDO DO SISTEMA — edite aqui para mudar textos, nome,
//  descrição, contato e categorias em toda a aplicação.
// ============================================================

// --- Marca ---------------------------------------------------
export const brand = {
  name: '3D Atelie',
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
