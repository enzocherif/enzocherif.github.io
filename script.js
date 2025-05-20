function sendEmail(event) {
	event.preventDefault();
	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const message = document.getElementById('message').value;
	const mailtoLink = `mailto:enzo.cherif@example.com?subject=Message%20de%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AEmail:%20${encodeURIComponent(email)}`;
	window.location.href = mailtoLink;
}
document.addEventListener("DOMContentLoaded", () => {
	// === Accordion ===
	const buttons = document.querySelectorAll(".accordion-button");
	buttons.forEach(button => {
		button.addEventListener("click", () => {
			const content = button.nextElementSibling;
			content.style.display = content.style.display === "block" ? "none" : "block";
		});
	});

	// === Terminal animation ===
	const terminalContent = document.getElementById("terminal-content");

	const translationsTerminal = {
		fr: [
			"....................Compétences en Programmation....................",
			"-> Python - Programmation pour l'analyse de données et le développement d'algorithmes",
			"-> MATLAB - Simulation et modélisation avancées",
			"-> C/C++ - Programmation embarquée et développement de logiciels",
			"-> C# - Pour faire des interfaces graphique : IHM",
			"-> Java - Développement backend et mobile",
			"-> SQL - Gestion de bases de données relationnelles",
			"-> HTML - Structuration des pages web",
			"-> CSS - Stylisation et mise en forme des pages web",
			"-> JavaScript - Interaction et dynamisme des interfaces web",
			"-> Bash - Automatisation de tâches via scripts shell"
			],
		en: [
			"....................Programming Skills....................",
			"-> Python - Programming for data analysis and algorithm development",
			"-> MATLAB - Advanced simulation and modeling",
			"-> C/C++ - Embedded programming and software development",
			"-> C# - For creating graphical interfaces: GUI",
			"-> Java - Backend and mobile development",
			"-> SQL - Management of relational databases",
			"-> HTML - Structuring web pages",
			"-> CSS - Styling and formatting web pages",
			"-> JavaScript - Interaction and dynamism in web interfaces",
			"-> Bash - Task automation using shell scripts"
			]
	};
let typingTimeout = null;
	let isTyping = false;

	const getLanguage = () => document.querySelector(".lang-btn.active")?.id === "lang-fr" ? "fr" : "en";

	const typeLetter = (commands, callback) => {
		let commandIndex = 0;
		let charIndex = 0;

		const type = () => {
			if (commandIndex < commands.length) {
				const currentCommand = commands[commandIndex];
				if (charIndex < currentCommand.length) {
					terminalContent.textContent += currentCommand[charIndex];
					charIndex++;
				} else {
					terminalContent.textContent += "\n";
					charIndex = 0;
					commandIndex++;
				}
				typingTimeout = setTimeout(type, 50);
			} else {
				isTyping = false;
				if (callback) callback();
			}
		};

		terminalContent.textContent = "";
		clearTimeout(typingTimeout);
		isTyping = true;
		type();
	};

	const updateTerminalContent = () => {
		if (isTyping) {
			clearTimeout(typingTimeout);
			isTyping = false;
		}
		const lang = getLanguage();
		typeLetter(translationsTerminal[lang]);
	};

	document.querySelectorAll(".lang-btn").forEach((btn) => {
		btn.addEventListener("click", updateTerminalContent);
	});

	// Init terminal au chargement
	updateTerminalContent();

	// === Scroll navbar effect ===
	document.addEventListener("scroll", () => {
		const nav = document.querySelector("nav");
		if (window.scrollY > 50) {
			nav.classList.add("scrolled");
		} else {
			nav.classList.remove("scrolled");
		}
	});
});
			document.addEventListener("DOMContentLoaded", () => {
				const translations = {
					fr: {
						"header-title": "Portfolio - Enzo CHERIF",
						"header-subtitle": "Bienvenue sur mon portfolio. Découvrez mes projets et expériences.",
						"nav-projects": "Projets",
						"nav-stages": "Stages",
						"nav-skills": "Compétences",
						"nav-contact": "Contact",
						"about-title": "À propos de moi",
						"about-description": `
							Je suis <strong>Enzo CHERIF</strong>, ingénieur en <strong>double diplôme</strong> à l’<strong>INP de Toulon</strong> (Institut National Polytechnique) et à l’<strong>Université de Toulon</strong>, spécialisé en <strong>robotique</strong>, <strong>mécatronique</strong> et <strong>systèmes embarqués</strong>.<br>
						Je travaille sur des projets variés mêlant <strong>Python</strong>, <strong>intelligence artificielle</strong>, <strong>traitement de données</strong>, <strong>ADAS</strong>, <strong>simulation sous MATLAB/Simulink</strong>, <strong>robotique mobile</strong>, et bien d’autres projets que je vous laisse découvrir sur mon site.<br>
						<strong>Polyvalent, rigoureux et passionné</strong>, je cherche à allier <strong>innovation</strong> et <strong>impact concret</strong> dans chaque défi technique.
						`,
						"post-title": "Poste Actuel",
						"post-role": "Stagiaire Développeur Outils d’Automatisation<br>Renault Group – Ampere Software Technology",
						"post-tasks": `
							<li>Réduction du temps de traitement de 1–2 semaines à 30 secondes, avec un taux d’erreur estimé à 1 %, grâce à l’automatisation de fichiers Excel complexes (Python, Pandas, NumPy, VBA).</li>
							<li>Création d’interfaces utilisateurs (Tkinter) adaptées aux ingénieurs, avec génération automatique de livrables (Word, PowerPoint) et envoi automatique par mail.</li>
							<li>Participation au projet <strong>Software-Defined Vehicle (SDV)</strong>, unité « Power Distribution & Activation » :</li>
							<ul>
								<li>Développement d’écrans XML pour le diagnostic de pannes via DDT2000.</li>
								<li>Tests fonctionnels sur banc et sur PIE (Plateforme d’intégration et d’essai) avec CANoe.</li>
							</ul>
							<li><em>Note : les livrables réalisés sont confidentiels et ne peuvent pas être montrés publiquement. Un rapport du stage sera prochainement communiqué.</em></li>
						`,
						"projects-title": "Projets",
						"project1-title": "Dynamique des Véhicules :",
						"project1-description": `Modélisation et Simulation en Matlab/Simulink d'un Système de Freinage Avancé : ABS et EBD. 
												  Ce projet explore la modélisation d'un système de freinage automobile, en mettant l'accent sur les systèmes ABS (anti-blocage des roues) 
												  et EBD (répartition électronique de freinage). À travers des simulations et analyses détaillées, il vise à améliorer la sécurité 
												  et l'efficacité du freinage dans divers scénarios, tout en intégrant des solutions innovantes pour optimiser la stabilité et réduire la distance d'arrêt.`,
						"project2-title": "Dynamique des Véhicules :",
						"project2-description": `Développement d'un simulateur MATLAB pour étudier la stabilité et le comportement dynamique des véhicules terrestres. 
												  Ce projet comprend la modélisation cinématique et dynamique de véhicules tels qu'un quad MF400H et une Mercedes Classe S, 
												  l'étude de leur stabilité, et la création d'une interface graphique interactive pour la simulation.`,
						"project3-title": "Traitement d'Image :",
						"project3-description": `Analyse en niveau de gris pour l'identification d'objets. 
												  Ce projet illustre l'utilisation d'algorithmes de traitement d'image pour analyser et segmenter des objets à partir d'images en niveaux de gris. 
												  L'objectif était d'automatiser l'identification et le comptage d'objets grâce à des outils tels que Python et OpenCV.`,
						"project4-title": "Programmation sous ROS :",
						"project4-description": `Développement d'un robot mobile autonome avec détection d'obstacles. 
												  Ce projet inclut la programmation d'un TurtleBot sous l'environnement ROS, permettant une navigation autonome et une détection avancée des obstacles.`,
						"project5-title": "Systèmes embarqués :",
						"project5-description": `Développement d'un système de pilotage et supervision d'un robot mobile en C#. 
												  Ce projet explore la conception et l’implémentation d’un système complet de supervision et pilotage d’un robot mobile, 
												  combinant programmation orientée objet en C#, communication série UART, et protocoles de communication embarqués. 
												  À travers une interface graphique intuitive et des tests sur microcontrôleurs, il met en avant des solutions robustes pour les systèmes embarqués.`,
						"project6-title": "Cartographie Marine :",
						"project6-description": `Cartographie des fonds marins au Domaine du Rayol. 
												  Ce projet, réalisé en collaboration avec Seatech, a permis de cartographier la posidonie grâce à l'imagerie satellite et aux données bathymétriques. 
												  Il met en avant des méthodes innovantes pour la conservation des écosystèmes marins et leur suivi à long terme.`,
						"project1-download": "Télécharger le rapport",
						"project2-download": "Télécharger le rapport",
						"project3-download": "Télécharger le rapport",
						"project4-download": "Télécharger le rapport",
						"project5-download": "Télécharger le rapport",
						"project6-download": "Télécharger le rapport",
						"internship-title": "Stage en Thaïlande - TFII, Bangkok",
						"internship-description": `Lors de mon stage au <strong>Thai-French Innovation Institute (TFII)</strong>, j'ai travaillé sur la <strong>gestion énergétique de véhicules électriques solaires</strong>. 
													Mon projet principal consistait à développer un système de contrôle pour optimiser l'utilisation et le stockage de l'énergie produite par des panneaux solaires, 
													tout en assurant la stabilité énergétique du véhicule. J'ai également utilisé des cartes <strong>Texas Instruments</strong> comme la TMS320F28335 pour concevoir 
													et tester des algorithmes de gestion d'énergie. Ce stage m'a permis d'acquérir une expertise en électronique et en gestion d'énergie dans un environnement multiculturel enrichissant.`,
						"reports-button": "Rapports de stage (Français et Anglais)",
						"report-french": "Rapport en Français",
						"report-english": "Rapport en Anglais",
						"labs-button": "Travaux Pratiques (TP) - en Anglais",
						"certifications-title": "Certifications",
						"certif-title": "Machine Learning avec Python",
						"certif-org": "FreeCodeCamp",
						"certif-link": "Voir la certification",
						"certif-proj1": "Book Recommendation Engine",
						"certif-proj2": "Rock Paper Scissors",
						"certif-proj3": "SMS Classifier",
						"certif-proj4": "Health Cost Regression Notebook",
						"tools-title": "Outils",
						"tool-matlab-simulink-title": "MATLAB Simulink",
						"tool-matlab-simulink-description": "Modélisation et simulation avancées",
						"tool-matlab-app-title": "MATLAB App Designer",
						"tool-matlab-app-description": "Création d'applications interactives pour la modélisation",
						"tool-labview-title": "LabVIEW",
						"tool-labview-description": "Conception d'applications de mesure et d'automatisation",
						"tool-ros-title": "ROS (Robot Operating System)",
						"tool-ros-description": "Contrôle et coordination de robots",
						"tool-linux-title": "Linux",
						"tool-linux-description": "Administration et développement sur systèmes Unix",
						"tool-git-title": "Git",
						"tool-git-description": "Gestion de version pour projets collaboratifs",
						"tool-latex-title": "LaTeX",
						"tool-latex-description": "Administration et développement sur systèmes Unix",
						"tool-solidworks-title": "SolidWorks",
						"tool-solidworks-description": "Modélisation 3D et simulation pour le design produit",
						"tool-catia-title": "Catia",
						"tool-catia-description": "Conception et modélisation de systèmes mécaniques",
						"tool-windows-title": "Windows",
						"tool-windows-description": "Systèmes d'exploitation pour l'utilisation quotidienne",
						"tool-excel-title": "Excel",
						"tool-excel-description": "Analyse de données et automatisation de tableaux",
						"tool-office-suite-title": "Microsoft Office Suite",
						"tool-office-suite-description": "Gestion documentaire et présentations professionnelles",
						"references-title": "Références",
						"reference1-text": `"Enzo a montré une rigueur exemplaire et un excellent esprit d'équipe. Il a toujours su apporter des solutions pertinentes aux problèmes techniques."`,
						"reference1-author": "- M. ..., Professeur des Universités SeaTech",
						"reference2-text": `"Son stage au TFII a été une réussite. Enzo a su s'adapter à une culture différente tout en produisant un travail de haute qualité."`,
						"reference2-author": "- M. Burin Yodwong, Tuteur de stage",
						"reference3-text": `"Sa capacité à comprendre des systèmes complexes et à les modéliser est impressionnante. Enzo est un élément moteur dans une équipe."`,
						"reference3-author": "- Mme ..., Chef de projet",
						"domains-title": "Domaines",
						"robotics-title": "Robotique",
						"robotics-description": "Systèmes autonomes et contrôle",
						"mechatronics-title": "Mécatronique",
						"mechatronics-description": "Intégration mécanique et électronique",
						"embedded-systems-title": "Systèmes embarqués",
						"embedded-systems-description": "Conception matérielle et logicielle",
						"timeline-title": "Mon parcours",
						"timeline-bac-title": "Bac S - Option SI",
						"timeline-bac-description": "Lycée Parc des Loges",
						"timeline-bac-date": "2019",
						"timeline-prepa-title": "Classe Préparatoire PTSI/PT",
						"timeline-prepa-description": "Lycée Parc de Vilgénis",
						"timeline-prepa-date": "2019 - 2022",
						"timeline-seatech-title": "SeaTech - INP Toulon",
						"timeline-seatech-description": "Ingénierie en mécatronique et robotique",
						"timeline-seatech-date": "2022 - 2025",
						"timeline-rise-title": "Master RISE",
						"timeline-rise-description": "Université de Toulon",
						"timeline-rise-date": "2024 - 2025",
						"contact-title": "Contact",
						"contact-email": `Email : <a href="mailto:enzocherife@gmail.com">enzocherife@gmail.com</a>`,
						"contact-linkedin": `LinkedIn : <a href="https://linkedin.com/in/enzocherif" target="_blank">linkedin.com/in/enzocherif</a>`,
						"contact-button": "Envoyer un email"
					},
					en: {
						"header-title": "Portfolio - Enzo CHERIF",
						"header-subtitle": "Welcome to my portfolio. Explore my projects and experiences.",
						"nav-projects": "Projects",
						"nav-stages": "Internships",
						"nav-skills": "Skills",
						"nav-contact": "Contact",
						"about-title": "About Me",
						"about-description": `
							I am <strong>Enzo CHERIF</strong>, an engineer pursuing a <strong>dual degree</strong> at <strong>INP Toulon</strong> (Institut National Polytechnique) and the <strong>University of Toulon</strong>, specialized in <strong>robotics</strong>, <strong>mechatronics</strong>, and <strong>embedded systems</strong>.<br>
							I work on a wide range of projects involving <strong>Python</strong>, <strong>artificial intelligence</strong>, <strong>data processing</strong>, <strong>ADAS</strong>, <strong>MATLAB/Simulink simulation</strong>, <strong>mobile robotics</strong>, and many other topics you can explore on this website.<br>
							<strong>Versatile, rigorous, and passionate</strong>, I strive to combine <strong>innovation</strong> with <strong>real-world impact</strong> in every technical challenge.
						`,
						"post-title": "Current Position",
						"post-role": "Intern – Automation Tools Developer<br>Renault Group – Ampere Software Technology",
						"post-tasks": `
							<li>Reduced processing time from 1–2 weeks to 30 seconds with an estimated error rate of 1%, through automation of complex Excel files (Python, Pandas, NumPy, VBA).</li>
							<li>Developed user interfaces (Tkinter) tailored for engineers, with automatic generation of deliverables (Word, PowerPoint) and automatic email sending.</li>
							<li>Contributed to the <strong>Software-Defined Vehicle (SDV)</strong> project, in the “Power Distribution & Activation” unit:</li>
							<ul>
								<li>Developed XML diagnostic screens for fault detection using DDT2000.</li>
								<li>Conducted functional testing on bench and on the PIE (Integration and Testing Platform) with CANoe.</li>
							</ul>
							<li><em>Note: The deliverables are confidential and cannot be publicly displayed. An internship report will be shared shortly.</em></li>
						`,
						"projects-title": "Projects",
						"project1-title": "Vehicle Dynamics:",
						"project1-description": `Modeling and Simulation in Matlab/Simulink of an Advanced Braking System: ABS and EBD. 
												  This project explores the modeling of an automotive braking system, focusing on ABS (anti-lock braking system) 
												  and EBD (electronic brake distribution). Through detailed simulations and analyses, it aims to improve braking safety 
												  and efficiency across various scenarios, while integrating innovative solutions to optimize stability and reduce stopping distance.`,
						"project2-title": "Vehicle Dynamics:",
						"project2-description": `Development of a MATLAB simulator to study the stability and dynamic behavior of land vehicles. 
												  This project involves kinematic and dynamic modeling of vehicles such as a MF400H quad and a Mercedes S-Class, 
												  studying their stability, and creating an interactive graphical interface for simulation.`,
						"project3-title": "Image Processing:",
						"project3-description": `Grayscale analysis for object identification. 
												  This project illustrates the use of image processing algorithms to analyze and segment objects from grayscale images. 
												  The objective was to automate object identification and counting using tools like Python and OpenCV.`,
						"project4-title": "Programming with ROS:",
						"project4-description": `Development of an autonomous mobile robot with obstacle detection. 
												  This project includes programming a TurtleBot in the ROS environment, enabling autonomous navigation and advanced obstacle detection.`,
						"project5-title": "Embedded Systems:",
						"project5-description": `Development of a control and supervision system for a mobile robot in C#. 
												  This project explores the design and implementation of a complete supervision and control system for a mobile robot, 
												  combining object-oriented programming in C#, UART serial communication, and embedded communication protocols. 
												  Through an intuitive graphical interface and tests on microcontrollers, it highlights robust solutions for embedded systems.`,
						"project6-title": "Marine Mapping:",
						"project6-description": `Mapping of seabeds at Domaine du Rayol. 
												  This project, carried out in collaboration with Seatech, involved mapping Posidonia seagrass using satellite imagery and bathymetric data. 
												  It highlights innovative methods for the conservation and long-term monitoring of marine ecosystems.`,
						"project1-download": "Download the report",
						"project2-download": "Download the report",
						"project3-download": "Download the report",
						"project4-download": "Download the report",
						"project5-download": "Download the report",
						"project6-download": "Download the report",
						"internship-title": "Internship in Thailand - TFII, Bangkok",
						"internship-description": `During my internship at the <strong>Thai-French Innovation Institute (TFII)</strong>, I worked on <strong>energy management for solar electric vehicles</strong>. 
													My main project was to develop a control system to optimize the use and storage of energy produced by solar panels, 
													while ensuring the energy stability required for the vehicle's operation. I also used <strong>Texas Instruments</strong> boards like the TMS320F28335 
													to design and test energy management algorithms. This internship allowed me to gain expertise in electronics and energy management while evolving in a rich multicultural environment.`,
						"reports-button": "Internship Reports (French and English)",
						"report-french": "Report in French",
						"report-english": "Report in English",
						"labs-button": "Lab Tutorials - in English",
						"certifications-title": "Certifications",
						"certif-title": "Machine Learning with Python",
						"certif-org": "FreeCodeCamp",
						"certif-link": "View Certification",
						"certif-proj1": "Book Recommendation Engine",
						"certif-proj2": "Rock Paper Scissors",
						"certif-proj3": "SMS Classifier",
						"certif-proj4": "Health Cost Regression Notebook",
						"tools-title": "Tools",
						"tool-matlab-simulink-title": "MATLAB Simulink",
						"tool-matlab-simulink-description": "Advanced modeling and simulation",
						"tool-matlab-app-title": "MATLAB App Designer",
						"tool-matlab-app-description": "Creating interactive applications for modeling",
						"tool-labview-title": "LabVIEW",
						"tool-labview-description": "Designing measurement and automation applications",
						"tool-ros-title": "ROS (Robot Operating System)",
						"tool-ros-description": "Robot control and coordination",
						"tool-linux-title": "Linux",
						"tool-linux-description": "Administration and development on Unix systems",
						"tool-git-title": "Git",
						"tool-git-description": "Version control for collaborative projects",
						"tool-latex-title": "LaTeX",
						"tool-latex-description": "Typesetting and scientific documentation",
						"tool-solidworks-title": "SolidWorks",
						"tool-solidworks-description": "3D modeling and simulation for product design",
						"tool-catia-title": "Catia",
						"tool-catia-description": "Design and modeling of mechanical systems",
						"tool-windows-title": "Windows",
						"tool-windows-description": "Operating systems for daily use",
						"tool-excel-title": "Excel",
						"tool-excel-description": "Data analysis and table automation",
						"tool-office-suite-title": "Microsoft Office Suite",
						"tool-office-suite-description": "Document management and professional presentations",
						"references-title": "References",
						"reference1-text": `"Enzo demonstrated exemplary rigor and an excellent team spirit. He consistently provided relevant solutions to technical problems."`,
						"reference1-author": "- Mr. ..., University Professor at SeaTech",
						"reference2-text": `"His internship at TFII was a success. Enzo adapted to a different culture while delivering high-quality work."`,
						"reference2-author": "- Mr. Burin Yodwong, Internship Supervisor",
						"reference3-text": `"His ability to understand complex systems and model them is impressive. Enzo is a driving force within a team."`,
						"reference3-author": "- Ms. ..., Project Manager",
						"domains-title": "Fields",
						"robotics-title": "Robotics",
						"robotics-description": "Autonomous systems and control",
						"mechatronics-title": "Mechatronics",
						"mechatronics-description": "Mechanical and electronic integration",
						"embedded-systems-title": "Embedded Systems",
						"embedded-systems-description": "Hardware and software design",
						"timeline-title": "My Journey",
						"timeline-bac-title": "Scientific Baccalaureate - SI Option",
						"timeline-bac-description": "Parc des Loges High School",
						"timeline-bac-date": "2019",
						"timeline-prepa-title": "Preparatory Classes PTSI/PT",
						"timeline-prepa-description": "Parc de Vilgénis High School",
						"timeline-prepa-date": "2019 - 2022",
						"timeline-seatech-title": "SeaTech - INP Toulon",
						"timeline-seatech-description": "Engineering in Mechatronics and Robotics",
						"timeline-seatech-date": "2022 - 2025",
						"timeline-rise-title": "Master RISE",
						"timeline-rise-description": "University of Toulon",
						"timeline-rise-date": "2024 - 2025",
						"contact-title": "Contact",
						"contact-email": `Email : <a href="mailto:enzocherife@gmail.com">enzocherife@gmail.com</a>`,
						"contact-linkedin": `LinkedIn : <a href="https://linkedin.com/in/enzocherif" target="_blank">linkedin.com/in/enzocherif</a>`,
						"contact-button": "Send an email"
					}
				};

				const langBtns = document.querySelectorAll(".lang-btn");

				const translate = (lang) => {
					Object.keys(translations[lang]).forEach((id) => {
						const element = document.getElementById(id);
						if (element) {
							element.innerHTML = translations[lang][id];
						}
					});
				};

				langBtns.forEach((btn) => {
					btn.addEventListener("click", () => {
						const lang = btn.id === "lang-fr" ? "fr" : "en";
						translate(lang);
						langBtns.forEach((b) => b.classList.remove("active"));
						btn.classList.add("active");
					});
				});

				// Traduire par défaut en français
				translate("fr");
			});

			document.addEventListener("scroll", () => {
				const nav = document.querySelector("nav");
				if (window.scrollY > 50) {
					nav.classList.add("scrolled");
				} else {
					nav.classList.remove("scrolled");
				}
			});