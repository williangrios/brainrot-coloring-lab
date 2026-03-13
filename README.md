DOCUMENTAÇÃO DO PRODUTO
Brainrot Coloring – Aplicativo de criação e pintura de personagens brainrot
Visão geral do produto

Brainrot Coloring é um aplicativo mobile onde usuários criam personagens absurdos no estilo “brainrot”, pintam esses personagens e compartilham suas criações nas redes sociais. O aplicativo é focado em criatividade, humor e viralização social. O usuário poderá combinar diferentes partes de personagens para gerar uma criatura única, colorir o personagem utilizando ferramentas de pintura digital e compartilhar o resultado final.

O aplicativo funcionará completamente offline, sem dependência de servidores ou APIs externas. Toda geração de personagens será feita localmente através de um sistema procedural que combina partes diferentes.

O modelo de monetização será freemium. Usuários gratuitos poderão criar um número limitado de desenhos e ganhar créditos adicionais ao compartilhar suas criações. Usuários premium terão acesso ilimitado ao aplicativo.

Plataformas e tecnologia

O aplicativo será desenvolvido para Android e iOS utilizando React Native com Expo. Essa tecnologia permite compartilhar grande parte do código entre as duas plataformas, reduzindo o tempo de desenvolvimento e manutenção.

Todo o aplicativo funcionará offline. Preferências, desenhos criados, créditos e configurações serão armazenados localmente no dispositivo.

Sistema multilíngue

O aplicativo será totalmente multilíngue. Todas as mensagens, textos, botões, alertas, telas e descrições estarão disponíveis em múltiplos idiomas.

A primeira tela exibida no aplicativo será a seleção de idioma. Nessa tela o usuário escolherá o idioma do aplicativo antes de continuar o onboarding.

Os idiomas suportados inicialmente serão:

Português (🇧🇷)
English (🇺🇸)
Español (🇪🇸)
Français (🇫🇷)
Deutsch (🇩🇪)
Italiano (🇮🇹)
Japanese / 日本語 (🇯🇵)
Korean / 한국어 (🇰🇷)
Chinese / 中文 (🇨🇳)
Arabic / العربية (🇸🇦)
Hindi / हिन्दी (🇮🇳)
Dutch / Nederlands (🇳🇱)

Cada idioma terá um código interno utilizado pelo sistema de tradução. Todos os textos do aplicativo deverão ser definidos em arquivos de tradução, permitindo expansão futura para novos idiomas.

Após selecionar o idioma, o aplicativo salvará essa preferência localmente e utilizará automaticamente a tradução correspondente em toda a interface.

Fluxo inicial do aplicativo

Ao abrir o aplicativo pela primeira vez o usuário verá a tela de seleção de idioma. Após escolher o idioma, ele continuará para o onboarding.

O onboarding apresentará o conceito do aplicativo e permitirá que o usuário escolha algumas preferências iniciais, como paletas de cores e ferramentas de pintura favoritas.

Após o onboarding, o usuário verá a tela de assinatura com teste gratuito. Mesmo que não assine, o usuário poderá continuar utilizando o aplicativo com limitações do plano gratuito.

Estrutura de navegação

O aplicativo utilizará navegação baseada em abas na parte inferior da tela. As abas principais serão Home, Create, Library, Explore e Profile.

A aba Home será a tela inicial do aplicativo. A aba Create permitirá montar personagens e iniciar o processo de pintura. A aba Library armazenará todos os desenhos feitos pelo usuário. A aba Explore mostrará categorias e sugestões. A aba Profile permitirá gerenciar assinatura, idioma e configurações.

Sistema de geração de personagens

Os personagens serão criados combinando diferentes partes gráficas. Cada personagem será formado por três componentes principais: cabeça, corpo e ambiente.

O aplicativo possuirá aproximadamente seiscentas partes distribuídas entre cabeças, corpos e ambientes. Essas partes serão combinadas automaticamente pelo sistema para gerar personagens únicos.

Por exemplo, uma cabeça de capivara pode ser combinada com um corpo de pizza e um acessório como fones de DJ, criando um personagem absurdo no estilo brainrot.

Esse sistema procedural permite criar milhares de combinações diferentes sem necessidade de armazenar milhares de imagens completas.

Categorias de personagens

Para facilitar a navegação, as partes de personagens poderão ser organizadas em categorias. Algumas categorias possíveis incluem brainrot animals, brainrot food, brainrot monsters, brainrot objects e brainrot fantasy.

As categorias ajudarão o usuário a explorar diferentes estilos e encontrar inspirações para novas criações.

Sistema de criação de personagem

Na tela de criação o usuário poderá montar o personagem escolhendo manualmente a cabeça, o corpo e os acessórios. Após montar a combinação desejada, o usuário poderá iniciar o processo de pintura.

No plano gratuito, o usuário não poderá reiniciar a combinação após começar a pintar. Ele precisará terminar o desenho atual antes de criar outro.

Usuários premium poderão reiniciar ou alterar a combinação de personagens a qualquer momento.

Sistema de pintura

Após gerar o personagem, o usuário será levado para a tela de pintura. O personagem aparecerá em formato de line art pronto para ser colorido.

O aplicativo oferecerá ferramentas de pintura como preenchimento automático de áreas, pincel livre, spray, marcador e borracha. Também haverá opções de desfazer e refazer ações, além de zoom para facilitar a pintura de detalhes.

As paletas de cores disponíveis serão exibidas na parte inferior da tela.

Finalização do desenho

Após terminar de pintar o personagem, o usuário será levado para a tela de finalização. Nessa tela o aplicativo sugerirá automaticamente dois nomes para o personagem brainrot criado.

O usuário poderá escolher um dos nomes sugeridos ou utilizar um campo chamado “Outro” para digitar qualquer nome personalizado.

O nome escolhido será associado ao personagem e utilizado no compartilhamento nas redes sociais.

Sistema de compartilhamento

Após finalizar e nomear o personagem, o usuário poderá compartilhar sua criação nas redes sociais.

O compartilhamento utilizará o menu nativo do sistema operacional, permitindo enviar a imagem para TikTok, Instagram, WhatsApp ou qualquer outro aplicativo instalado.

A legenda padrão incluirá o nome do personagem escolhido pelo usuário e uma mensagem promocional do aplicativo, por exemplo:

“Made with Brainrot Coloring – meet my character [nome do personagem]. Download the app here: [link da loja]”.

Marca d’água no plano gratuito

Usuários gratuitos terão uma marca d’água aplicada automaticamente na imagem exportada. Essa marca d’água aparecerá no canto da imagem com o texto “Made with Brainrot Coloring”.

Usuários premium poderão exportar imagens sem marca d’água.

Sistema de créditos

Usuários gratuitos receberão um crédito inicial ao instalar o aplicativo. Cada desenho criado consome um crédito.

Após finalizar um desenho, o usuário poderá ganhar um crédito adicional ao compartilhar sua criação nas redes sociais.

O número máximo de créditos adicionais obtidos através de compartilhamento será três. Isso significa que um usuário gratuito poderá criar no máximo quatro desenhos no total.

Após utilizar todos os créditos gratuitos, o usuário precisará adquirir o plano premium para continuar criando novos desenhos.

Regras do plano gratuito

Usuários gratuitos poderão ter apenas um desenho ativo por vez. Após iniciar um desenho, o usuário não poderá cancelar ou reiniciar a combinação do personagem. Ele deverá terminar o desenho antes de criar outro.

Todas as imagens exportadas no plano gratuito terão marca d’água.

Regras do plano premium

Usuários premium terão acesso completo ao aplicativo. Eles poderão criar personagens ilimitados, reiniciar personagens a qualquer momento, iniciar múltiplos desenhos simultaneamente, exportar imagens sem marca d’água e acessar todas as paletas de cores e ferramentas de pintura disponíveis.

Biblioteca de desenhos

O aplicativo terá uma biblioteca onde todos os desenhos criados pelo usuário serão armazenados. A biblioteca exibirá os desenhos em formato de grade com miniaturas.

O usuário poderá abrir um desenho para visualizá-lo novamente, compartilhar a imagem ou excluí-lo da biblioteca.

Armazenamento local

Todos os dados do usuário serão armazenados localmente no dispositivo. Isso inclui idioma selecionado, preferências do usuário, desenhos criados, nomes dos personagens, créditos restantes e status da assinatura.

Performance e tamanho do aplicativo

O aplicativo deve ser otimizado para funcionar de forma leve e rápida. Como não haverá backend ou processamento em nuvem, os custos operacionais serão praticamente zero após a publicação.

O tamanho final do aplicativo deve permanecer abaixo de aproximadamente cem megabytes.

Estratégia de crescimento

O aplicativo utilizará compartilhamento social como principal mecanismo de crescimento. Cada desenho compartilhado incluirá automaticamente uma legenda promocional e marca d’água com o nome do aplicativo, incentivando outras pessoas a conhecerem e instalarem o aplicativo.

Essa estratégia transforma os próprios usuários em promotores naturais do produto.