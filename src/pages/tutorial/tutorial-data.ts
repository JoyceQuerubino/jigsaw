type TutorialType = {
  id: number;
  title: string;
  text?: string;
  list?: string[];
};

const listTips = [
  "1. Defina objetivos e metas centradas no usuário, ao seu perfil e cotidiano.",
  "2. Priorize cores claras e contrastantes, preferidas pelo usuário.",
  "3. Use linguagem visual e textual simples, clara e com símbolos familiares, evitando jargões, metáforas e ambiguidades.",
  "4. Utilize elementos reconhecíveis e cotidianos.",
  "5. Foque na tarefa e evite distrações que possam sobrecarregar o usuário.",
  "6. Ofereça instruções claras e suporte contínuo, com reforços positivos e sem feedbacks negativos em caso de erro.",
  "7. Permita tentativas antes de mostrar a resposta correta.",
  "8. Permita que o usuário gerencie o tempo da atividade.",
  "9. Monitore e avalie o progresso do usuário com feedbacks.",
  "10. Inclua imagens de personagens preferidos do usuário para facilitar o aprendizado e promover empatia.",
];

export const tutorialData: TutorialType[] = [
  {
    id: 0,
    title: "Qual o objetivo da plataforma?",
    text: "Auxiliar profissionais da saúde e educação, no desenvolvimento de atividades pedagógicas, no formato de jogos adaptados para autistas.",
  },
  {
    id: 1,
    title: "Como aplicar atividades?",
    text: "Utilize os modelos de atividades prontas (em Jogar) ou desenvolva suas próprias atividades (em Meus Jogos).",
  },
  {
    id: 2,
    title: "Como criar atividades?",
    text: 'Entre em "Meus Jogos", por padrão, será selecionado o formato de quebra-cabeças. Em seguida, clique em "Novo Jogo", para que possa nomear e inserir a imagem da atividade de quebra-cabeças.',
  },
  {
    id: 3,
    title: "Como editar meus atividades?",
    text: 'Entre em "Meus Jogos", por padrão, será selecionado o formato de quebra-cabeças. Em seguida, clique no jogo que deseja editar, assim poderá mudar o seu nome e imagem.',
  },
  {
    id: 4,
    title: "Como criar atividades para autistas?",
    list: listTips,
  },
];
