type TutorialType = {
  id: number;
  title: string;
  text?: string;
  list?: string[];
};

const listTips = [
  "1. Defina objetivos e metas centradas no usuário, ao seu perfil e cotidiano.",
  "2. Utilize cores contrastantes e preferidas, com fundo claro ou branco.",
  "3. Utilize linguagem visual e textual clara, simples e com símbolos familiares.",
  "4. Utilize elementos reconhecíveis e cotidianos.",
  "5. Foque na tarefa e evite distrações.",
  "6. Ofereça instruções claras e suporte contínuo, com reforços positivos.",
  "7. Permita tentativas antes de mostrar a resposta correta.",
  "8. Deixe o controle de tempo nas mãos do usuário, sem expiração automática.",
  "9. Monitore e avalie o progresso do usuário com feedbacks claros.",
  "10. Inclua personagens virtuais para facilitar o aprendizado e promover empatia.",
];

const warninglist = [
    "1. Não utilize apenas cores como recurso de comunicação.",
    "2. Evite jargões, metáforas ou expressões ambíguas.",
    "3. Não sobrecarregue o usuário com elementos distrativos.",
    "4. Não exiba feedbacks negativos quando o usuário cometer erros.",
    "5. Evite limitar o tempo nas tarefas."
]

export const tutorialData: TutorialType[] = [
  {
    id: 0,
    title: "Qual o objetivo da plataforma?",
    text: "Auxiliar profissionais da saúde e educação, no desenvolvimento de atividades pedagógicas, no formato de jogos adaptados para autistas.",
  },
  {
    id: 1,
    title: "Como aplicar jogos/atividades?",
    text: "Utilize os modelos de atividades prontas (em Jogar) ou desenvolva suas próprias atividades (em Meus Jogos).",
  },
  {
    id: 2,
    title: "Como criar jogos/atividades?",
    text: 'Entre em "Meus Jogos", por padrão, será selecionado o formato de quebra-cabeças. Em seguida, clique em "Novo Jogo", para que possa nomear e inserir a imagem da atividade de quebra-cabeças.',
  },
  {
    id: 3,
    title: "Como editar meus jogos/atividades?",
    text: 'Entre em "Meus Jogos", por padrão, será selecionado o formato de quebra-cabeças. Em seguida, clique no jogo que deseja editar, assim poderá mudar o seu nome e imagem.',
  },
  {
    id: 4,
    title: "Como criar atividades para autistas?",
    list: listTips,
  },
  {
    id: 5,
    title: "Como criar atividades para autistas?",
    text: "Tenha cuidado:",
    list: warninglist,
  },
];
