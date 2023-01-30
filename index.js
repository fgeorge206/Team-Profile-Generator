const fs = require("fs");
const inquirer = require("inquirer");
const Manager = require("./Develop/lib/Manager.js");
const Engineer = require("./Develop/lib/Engineer.js");
const Intern = require("./Develop/lib/Intern.js");
const generateHTML = require("./Develop/util/generateHtml.js");
const team = [];
let askPosition = "Manager";
const menuOptions = ["Engineer", "Intern", "Done Building Team"];


function buildTeam() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: `What is the ${askPosition}'s name?`,
            },
            {
                type: "input",
                name: "id",
                message: `What is the ${askPosition}'s employee id?`,
            },
            {
                type: "input",
                name: "email",
                message: `What is the ${askPosition}'s email?`,
            },
		])
		.then((answers) => {
			switch (askPosition) {
				case "Manager":
					askManager(answers);
					break;
				case "Engineer":
					askEngineer(answers);
					break;
				case "Intern":
					askIntern(answers);
					break;
				default:
					console.log("That's not a valid role.");
					break;
			}
		});
}

function askManager(genQuestions) {
	inquirer
		.prompt({
			type: "input",
			name: "officeNumber",
			message: "What is the Manager's office number?",
			validate(value) {
				const pass = value.match(/^[0-9]+$/);
				if (pass) {
					return true;
				}
				return "Please enter a valid room number.";
			},
		})
		.then((answers) => {
			const manager = new Manager(genQuestions.name, genQuestions.id, genQuestions.email, answers.officeNumber);
			team.push(manager);
			menuSelect();
		});
}

function askEngineer(genQuestions) {
	inquirer
		.prompt({
			type: "input",
			name: "github",
			message: "What is the Engineer's GitHub username?",
		})
		.then((answers) => {
			const engineer = new Engineer(genQuestions.name, genQuestions.id, genQuestions.email, answers.github);
			team.push(engineer);
			menuSelect();
		});
}

function askIntern(genQuestions) {
	inquirer
		.prompt({
			type: "input",
			name: "school",
			message: "What is the Intern's school?",
		})
		.then((answers) => {
			const intern = new Intern(genQuestions.name, genQuestions.id, genQuestions.email, answers.school);
			team.push(intern);
			menuSelect();
		});
}

function menuSelect() {
	inquirer
		.prompt({
			type: "list",
			name: "ask",
			message: "What type of team member would you like to add to your team?",
			choices: menuOptions,
		})
		.then((answers) => {
			askPosition = answers.ask;
			if (answers.ask == "Done Building Team") {
				console.log("Building team complete.");
				fs.writeFile("./dist/teamProfile.html", generateHTML(team), (err) =>
                    err ? console.log(err) : console.log("teamProfile.html generated.")
                    );
                } else {
                    buildTeam();
                }
		});
}

buildTeam();