import { ALL_JOBS } from "@/data/jobs";
import { xpFromLevel } from '@/data/experience'
import { EventBus } from "@/utils/eventBus.js";

export const BASE_BONUS = 5;
export const ITEM_INTERVALS = [20, 35, 50, 65, 75, 85, 92, 97, 100];
export const ENEMY_INTERVALS = [60, 80, 100];
export const JOB_INTERVALS = [25, 45, 60, 70, 80, 90, 95, 97, 99, 100];

const BASE_PURCHASES = {
	resetSimulation: {
		name: "_simulation.Reset()",
		description: "Reset your game, gaining the Bluespace Time listed at the start of all future playthroughs",
		icon: require('@/assets/art/chrono/bluetime.png'),
		requiredItems: {
			bluetimeEmpty: 1
		},
		onPurchase(store) {
			store.dispatch(`chrono/resetSimulation`, {}, { root: true });
		}
	},
	chronoToCash: {
		name: "Chrono-To-Cash",
		description: "Gain $100,000",
		icon: require('@/assets/art/misc/coin-padded.png'),
		requiredItems: {
			bluetime: 1
		},
		items: {
			id: "money",
			count: 100000
		},
	},
	chronoToTime: {
		name: "Buy Time",
		description: "Add 25 minutes to the time bank",
		icon: require('@/assets/art/chrono/bluetime.png'),
		requiredItems: {
			bluetime: 1
		},
		onPurchase(store) {
			store.commit(`chrono/addTime`, 25 * 60 * 1000, { root: true });
			EventBus.$emit("toast", { icon: require('@/assets/art/chrono/bluetime.png'), text: `Time Gained!`, duration: 2500 });
		}
	},
	antagRoll1: {
		name: "Antag Roll",
		description: "Acquire aid from a nefarious faction.",
		icon: require("@/assets/art/shop/items/antag_anim.gif"),
		requiredItems: {
			bluetime: 10
		},
		items: {
			id: "antag",
		},
		upgrade: "antagRoll",
		requiredUpgrades: {
			antagRoll: 0
		}
	},
	antagRoll2: {
		name: "Antag Roll",
		description: "Acquire aid from a nefarious faction.",
		icon: require("@/assets/art/shop/items/antag_anim.gif"),
		requiredItems: {
			bluetime: 50
		},
		items: {
			id: "antag",
		},
		upgrade: "antagRoll",
		requiredUpgrades: {
			antagRoll: 1
		}
	},
	antagRoll3: {
		name: "Antag Roll",
		description: "Acquire aid from a nefarious faction.",
		icon: require("@/assets/art/shop/items/antag_anim.gif"),
		requiredItems: {
			bluetime: 100
		},
		items: {
			id: "antag",
		},
		upgrade: "antagRoll",
		requiredUpgrades: {
			antagRoll: 2
		}
	},
	antagRoll4: {
		name: "Antag Roll",
		description: "Acquire aid from a nefarious faction.",
		icon: require("@/assets/art/shop/items/antag_anim.gif"),
		requiredItems: {
			bluetime: 200
		},
		items: {
			id: "antag",
		},
		upgrade: "antagRoll",
		requiredUpgrades: {
			antagRoll: 3
		}
	},
	timeBankSize1: {
		name: "Expand Time Bank I",
		description: "Increases the maximum capacity of the time bank from 12 hours, to 24 hours",
		icon: require('@/assets/art/chrono/timebank.png'),
		requiredItems: {
			bluetime: 1
		},
		upgrade: "timeBankSize",
		requiredUpgrades: {
			timeBankSize: 0
		}
	},
	timeBankSize2: {
		name: "Expand Time Bank II",
		description: "Increases the maximum capacity of the time bank from 24 hours, to 48 hours",
		icon: require('@/assets/art/chrono/timebank.png'),
		requiredItems: {
			bluetime: 2
		},
		upgrade: "timeBankSize",
		requiredUpgrades: {
			timeBankSize: 1
		}
	},
	timeBankOptions1: {
		name: "Time Bank Options I",
		description: "Allows you to use the time bank at x7.5 speed",
		icon: require('@/assets/art/chrono/icon.png'),
		requiredItems: {
			bluetime: 1
		},
		upgrade: "timeBankOptions",
		requiredUpgrades: {
			timeBankOptions: 0
		}
	},
	timeBankOptions2: {
		name: "Time Bank Options II",
		description: "Allows you to use the time bank at x10 speed",
		icon: require('@/assets/art/chrono/icon.png'),
		requiredItems: {
			bluetime: 2
		},
		upgrade: "timeBankOptions",
		requiredUpgrades: {
			timeBankOptions: 1
		}
	},
	timeBankAutoPause: {
		name: "Auto-Pause Chrono Acceleration",
		description: "Time is no longer drained when you aren't doing a job or in combat",
		icon: require('@/assets/art/chrono/timebank-octo.png'),
		requiredItems: {
			bluetime: 1
		},
		upgrade: "timeBankAutoPause",
		requiredUpgrades: {
			timeBankAutoPause: 0
		}
	}
}

const JOB_PURCHASES = {}
const JOB_COSTS = [1, 2, 3, 4, 5];

ALL_JOBS.forEach(job => {
	for (let i = 0; i < 5; i++) {
		let isValidhunting = job.id == "validhunting";
		if (job.isCombat && !isValidhunting) return;
		if (job.noJobBlitz) return;

		let id = `level${job.id}`;
		let from = Math.max(1, i * 10);
		let to = (i + 1) * 10
		let cost = JOB_COSTS[i];
		let xp = xpFromLevel(to) - xpFromLevel(from) + 1;
		if (isValidhunting) cost *= 3;

		let upgrade = {
			name: `Level ${job.name} ${from}-${to}`,
			description: `Gain ${xp.toLocaleString()} ${job.name} experience, enough to level from ${from} to ${to}`,
			icon: job.icon,
			requiredItems: {
				bluetime: cost
			},
			upgrade: id,
			requiredUpgrades: {},
			onPurchase(store) {
				store.commit(`${job.id}/addXP`, xp, { root: true });
				EventBus.$emit("toast", { icon: job.icon, text: `XP Gained!.`, duration: 5000 });
			}
		}
		upgrade.requiredUpgrades[id] = i;
		JOB_PURCHASES[id + i] = upgrade;
	}
});

export const SECTIONS = [
	{
		name: "Chrono Exchange",
		purchases: ["chronoToCash", "chronoToTime", "antagRoll1", "antagRoll2", "antagRoll3", "antagRoll4"]
	},
	{
		name: "Time Bank Upgrades",
		purchases: ["timeBankSize1", "timeBankSize2", "timeBankOptions1", "timeBankOptions2", "timeBankAutoPause"]
	},
	{
		name: "Job Blitz",
		purchases: Object.keys(JOB_PURCHASES)
	},
]

export const PURCHASES = {
	...BASE_PURCHASES,
	...JOB_PURCHASES
}