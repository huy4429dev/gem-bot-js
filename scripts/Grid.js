Number.prototype.negativeOneToFalse = function() {
	return this.valueOf() === -1 ? false : this;
};

Boolean.prototype.negativeOneToFalse = function() {
	return false;
};

function union (sets) {
    return sets.reduce((combined, list) => {
      return new Set([...combined, ...list]);
    }, new Set());
}
class GridDistinction {
    removedGems = [];
    matchesSize = [];
}
class Grid {
	constructor(gemsCode, gemModifiers, gemTypes) {
		this.gems = [];
		this.gemeCode = gemsCode;
		this.gemTypes = new Set();
		this.updateGems(gemsCode, gemModifiers);
        this.myHeroGemType = gemTypes;
	}

	updateGems(gemsCode, gemModifiers) {
		this.gems = [];
		this.gemeCode = gemsCode;
		this.gemTypes = new Set();
        for (let i = 0; i < gemsCode.size(); i++) {
            let gem = new Gem(i, gemsCode.getByte(i), gemModifiers != null ? gemModifiers.getByte(i) : GemModifier.NONE);
			this.gems.push(gem);
			this.gemTypes.add(gem.type);
		}
	}

	recommendSwapGem() {
        
		let listMatchGem = this.suggestMatch();

		if (listMatchGem.length === 0) {
			return [-1, -1];
		}

        this.adidaphat();
        this.adidaphat();
        this.adidaphat();

		const matchGem = this.prioritySwapGem(listMatchGem);

		if (matchGem) return matchGem.getIndexSwapGem();
        
		const listMatchTypes = listMatchGem.map((item) => item.type);
		let matchIndex = 0;
        if(checkKillChampion()){
            matchIndex = this.getMatchGemEndGame(listMatchTypes);
        }
		else if (!midGame) {
			matchIndex = this.getMatchGemStartGame(listMatchTypes);
		} 
        else{
			matchIndex = this.getMatchGemMidGame(listMatchTypes);
		}

        if(!matchIndex || !listMatchGem[matchIndex]) {
            matchIndex = 0;
            console.log("ERRRRRRORRRRRRR")
        }
		return listMatchGem[matchIndex].getIndexSwapGem();
	}

	prioritySwapGem(listMatchGem) {
        let matchGem = listMatchGem.find(x => x.sizeMatch > 4); if(matchGem) return matchGem;;
         
        for (const m of GemModifierPower ) {
            matchGem  = listMatchGem.find(xx => xx.modifier == m);
           if(matchGem) return matchGem;
        }

        matchGem =  this.checkMatchGemGroup(listMatchGem);
  
        if(matchGem) return matchGem;
		matchGem = !midGame ? listMatchGem.find(x => x.sizeMatch > 3 && 
                                                     x.type != GemType.SWORD && 
                                                     x.type != GemType.RED && 
                                                     x.type != GemType.PURPLE
                                                ) : false;
		matchGem = matchGem ||listMatchGem.find(x => midGame &&	
                                                     x.sizeMatch > 3 && 
                                                     x.type != GemType.GREEN && 
                                                     x.type != GemType.YELLOW && 
                                                     x.type != GemType.RED && 
                                                     x.type != GemType.PURPLE);
		console.log("prioritySwapGem -----------------", matchGem);
		return matchGem;
	}

    checkMatchGemGroup(listMatchGem){

        listMatchGem.forEach(item => {
            const temp =  listMatchGem.find(x => item.index1 == x.index2 && item.index2 == x.index1);
            if(temp)
            item.type2 = temp.type;    
        })

        let any = listMatchGem.some(item => item.type2);
        if(!any) return false;

        console.log("checkMatchGemGroup",console.log(listMatchGem))

        // handle get gem optimize
        if(!midGame){
        for (const item of listMatchGem) {
            if(item.type == GemType.GREEN ||
               item.type == GemType.YELLOW &&
               item.type2 == GemType.GREEN ||
               item.type2 == GemType.YELLOW 
               ){
                   console.log(item,'itemMatchGroup')
                return item;
              }
          }
        }

        if(!midGame){
            for (const item of listMatchGem) {
                    if(
                       (!CERBERUS.isFullMana() && CERBERUS.isAlive() && (item.type == GemType.BLUE || item.type == GemType.BROWN)) &&
                       ((item.type2 == GemType.BLUE || item.type2 == GemType.BROWN)) 
                       ){
                           console.log(item,'itemMatchGroup')
                        return item;
                      }
                }
            }

        if(!midGame){
            for (const item of listMatchGem) {
                    if(
                       (DISPATER.isAlive() && (item.type == GemType.RED || item.type == GemType.PURPLE)) &&
                       ((item.type2 == GemType.RED || item.type2 == GemType.PURPLE)) 
                       ){
                           console.log(item,'itemMatchGroup')
                        return item;
                      }
                }
        }
    

        if(midGame){
        for (const item of listMatchGem) {
                if(
                   (CERBERUS.isAlive() && (item.type == GemType.BLUE || item.type == GemType.BROWN)) &&
                   ( (item.type2 == GemType.BLUE || item.type2 == GemType.BROWN)) 
                   ){
                       console.log(item,'itemMatchGroup')
                    return item;
                  }
            }
        }

        if(midGame){
            for (const item of listMatchGem) {
                    if(
                       (DISPATER.isAlive() && (item.type == GemType.RED || item.type == GemType.PURPLE)) &&
                       ((item.type2 == GemType.RED || item.type2 == GemType.PURPLE)) 
                       ){
                           console.log(item,'itemMatchGroup')
                        return item;
                      }
                }
        }
        return false;   

        // GREEN - BLUE 

        // GREEN - BROWN 

        // RED - PURPLE
    }

	getMatchGemEnemy(listMatchTypes) {
		return false;
	}

	getMatchGemStartGame(listMatchTypes) {
		return (
			this.getMatchGemTerraGreen(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemCerberusBlue(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemTerra(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemCerberus(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemEnemy(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemDISPATER(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemSWORD(listMatchTypes).negativeOneToFalse() ||
			this.adidaphat(listMatchTypes.length - 1)
		);
	}

	getMatchGemMidGame(listMatchTypes) {
		return (
            this.getMatchGemCerberusBlue(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemCerberus(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemTerraGreen(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemTerra(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemEnemy(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemDISPATER(listMatchTypes).negativeOneToFalse() ||
			this.getMatchGemSWORD(listMatchTypes).negativeOneToFalse() ||
			this.adidaphat(listMatchTypes.length - 1)
		);
	}

    getMatchGemEndGame(listMatchTypes) {
        return (
			this.getMatchGemEnemy(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemSWORD(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemCerberusBlue(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemCerberus(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemDISPATER(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemTerraGreen(listMatchTypes).negativeOneToFalse() ||
            this.getMatchGemTerra(listMatchTypes).negativeOneToFalse() ||
			this.adidaphat(listMatchTypes.length - 1)
        );
    }

    getMatchGemTerraGreen(listMatchTypes) {
		if (!SEA_SPIRIT.isAlive() || SEA_SPIRIT.isFullMana()) return false;
		return this.getIndexGem(listMatchTypes, [GemType.GREEN]);
	}
	getMatchGemTerra(listMatchTypes) {
		if (!SEA_SPIRIT.isAlive() || SEA_SPIRIT.isFullMana()) return false;
		return this.getIndexGem(listMatchTypes, [GemType.GREEN, GemType.YELLOW]);
	}

    getMatchGemCerberus(listMatchTypes) {
		if (!CERBERUS.isAlive() || CERBERUS.isFullMana()) return false;
		return this.getIndexGem(listMatchTypes, [GemType.BLUE, GemType.BROWN]);
	}

	getMatchGemCerberusBlue(listMatchTypes) {
		if (!CERBERUS.isAlive() || CERBERUS.isFullMana()) return false;
		return this.getIndexGem(listMatchTypes, [GemType.BLUE]);
	}

	getMatchGemDISPATER(listMatchTypes) {
		if (!DISPATER.isAlive() || DISPATER.isFullMana()) return false;
		return this.getIndexGem(listMatchTypes, [GemType.RED, GemType.PURPLE]);
	}

	getMatchGemSWORD(listMatchTypes) {
		return this.getIndexGem(listMatchTypes, [GemType.SWORD]);
	}

	getIndexGem(listMatchTypes, types) {
		for (const type of types) {
			const index = listMatchTypes.indexOf(type);
			if (index != -1) return index;
		}
		return false;
	}

	adidaphat(max) {
        console.log(`
            Nam mô a di Đà Phật! 🙏 🙏 🙏
            Nam mô a di Đà Phật! 🙏 🙏 🙏 
            Nam mô a di Đà Phật! 🙏 🙏 🙏
        `);
        if(!max) return false;
		return Math.floor(Math.random() * max);
	}

    suggestMatch() {
        let listMatchGem = [];

        const tempGems = [...this.gems];

        tempGems.forEach(currentGem => {

            let swapGem = null;
            // If x > 0 => swap left & check

            // console.log("currentGem : ", currentGem);
            if (currentGem.x > 0) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x - 1), parseInt(currentGem.y))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If x < 7 => swap right & check
            if (currentGem.x < 7) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x + 1), parseInt(currentGem.y))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If y < 7 => swap up & check
            if (currentGem.y < 7) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x), parseInt(currentGem.y + 1))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If y > 0 => swap down & check
            if (currentGem.y > 0) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x), parseInt(currentGem.y - 1))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
        })
        return listMatchGem;
    }

    checkMatchSwapGem(listMatchGem, currentGem, swapGem) {

        if(currentGem.locked || swapGem.locked) {
            return;
        }

        this.swap(currentGem, swapGem);

        let matchGems = this.matchesAt(parseInt(currentGem.x), parseInt(currentGem.y));

        this.swap(currentGem, swapGem);


        if (matchGems.size > 0) {
            listMatchGem.push(new GemSwapInfo( listMatchGem?.length ? listMatchGem.length : 0, currentGem.index, swapGem.index, matchGems.size, currentGem.type,currentGem.modifier));
        }
    }

	getGemIndexAt(x, y) {
		return x + y * 8;
	}

	swap(a, b) {
		let tempIndex = a.index;
		let tempX = a.x;
		let tempY = a.y;

		// update reference
		this.gems[a.index] = b;
		this.gems[b.index] = a;

		// update data of element
		a.index = b.index;
		a.x = b.x;
		a.y = b.y;

		b.index = tempIndex;
		b.x = tempX;
		b.y = tempY;
	}

	swapIndex(index1, index2) {
		const gem1 = this.gems[index1];
		const gem2 = this.gems[index2];
		return this.swap(gem1, gem2);
	}

    matchesAt(x, y) {
        let res = new Set();

        let center = this.gemAt(x, y);

        if(center.type === -1 || center.removed || center.locked) {
            return res;
        }

        if (center === undefined) {

            console.error("gem center undefined");
            return res;
        }

        // check horizontally
        let hor = [];
        hor.push(center);
        let xLeft = x - 1, xRight = x + 1;
        while (xLeft >= 0) {
            let gemLeft = this.gemAt(xLeft, y);
            if (gemLeft) {
                if (!gemLeft.sameType(center)) {
                    break;
                }
                hor.push(gemLeft);
            }
            xLeft--;
        }
        while (xRight < 8) {
            let gemRight = this.gemAt(xRight, y);
            if (gemRight) {
                if (!gemRight.sameType(center)) {
                    break;
                }
                hor.push(gemRight);
            }
            xRight++;
        }
        if (hor.length >= 3) hor.forEach(gem => res.add(gem));

        // check vertically
        let ver = [];
        ver.push(center);
        let yBelow = y - 1, yAbove = y + 1;
        while (yBelow >= 0) {
            let gemBelow = this.gemAt(x, yBelow);
            if (gemBelow) {
                if (!gemBelow.sameType(center)) {
                    break;
                }
                ver.push(gemBelow);
            }
            yBelow--;
        }
        while (yAbove < 8) {
            let gemAbove = this.gemAt(x, yAbove);
            if (gemAbove) {
                if (!gemAbove.sameType(center)) {
                    break;
                }
                ver.push(gemAbove);
            }
            yAbove++;
        }
        if (ver.length >= 3) ver.forEach(gem => res.add(gem));

        return res;
    }

    // Find Gem at Position (x, y)
    gemAt(x, y) {
        return this.gems.find(g => g.x === x && g.y === y)
    }

    performSwap(index1, index2) {
        const currentGem = this.gems[index1];
        const swapGem = this.gems[index2];
        console.log(currentGem, swapGem);
        this.swap(currentGem, swapGem);
        const allMatchGems = this.getAllMatches();
        const distinction = new GridDistinction();
        const result = this.performDistinction(allMatchGems, distinction);
        return result;
    }

    getAllMatches() {
        const matches = [];
        for(const gem of this.gems) {
            const matchGems = this.matchesAt(parseInt(gem.x), parseInt(gem.y)); 
            if(matchGems.size > 0) {
                matches.push(matchGems);
            }
        }
        return matches.length > 0 ? matches : [];
    }

    performDistinction(allMatchGems, distinction) {
        for(const matchGems of allMatchGems) {
            this.distinctGemBatch(matchGems, distinction)
        }
        this.performReshape();
        const nextMatches = this.getAllMatches();
        if(nextMatches.length > 0) {
            this.performDistinction(nextMatches, distinction);
        } 
        return distinction;
    }

    performGemEffect(gem, distinction) {
        switch(gem.modifier) {
            case GemModifier.EXPLODE_HORIZONTAL: {
                this.performExplodeHorizontal(gem, distinction);
            } 
            case GemModifier.EXPLODE_VERTICAL: {
                this.performExplodeVertical(gem, distinction);
            } 
            case GemModifier.EXPLODE_SQUARE: {
                this.performExplodeSquare(gem, distinction);
            } 
        }
    }

    performExplodeHorizontal(gem, distinction) {
        for(let x = 0; x < 8; x++) {
            const targetGem = this.gemAt(x, gem.y);
            if(!targetGem.sameOne(gem)) {
                this.distinctGem(targetGem, distinction);
            }
        }
    }

    performExplodeVertical(gem, distinction) {
        for(let y = 0; y < 8; y++) {
            const targetGem = this.gemAt(gem.x, y);
            if(!targetGem.sameOne(gem)) {
                this.distinctGem(targetGem, distinction);
            }
        }
    }

    performExplodeSquare(gem, distinction) {
        for(let x = gem.x - 1; x < gem.x + 1; x++) {
            for(let y = gem.y - 1; y < gem.y + 1; y++) {
                const targetGem = this.gemAt(gem.x, y);
                if(!targetGem.sameOne(gem)) {
                    this.distinctGem(targetGem, distinction);
                }
            }
        }
    }

    distinctGemBatch(gems, distinction) {
        distinction.matchesSize.push(gems.size);
        for(const gem of gems) {
            this.distinctGem(gem, distinction);
        }
        
    }

    maxLinearMatch(gems) {
        const matchesX = {};
        const matchesY = {};

        for(const gem of gems) {
            matchesX[gem.x] = matchesX[gem.x] ? 1 : matchesX[gem.x] + 1;  
            matchesY[gem.y] = matchesY[gem.y] ? 1 : matchesY[gem.y] + 1;  
        }

        const maxX = Math.max(...Object.values(matchesX));
        const maxY = Math.max(...Object.values(matchesY));
        return Math.max(maxX, maxY);

    }

    distinctGem(gem, distinction) {
        if(gem.removed || gem.locked) {
            return;
        }
        gem.removed = true;
        this.performGemEffect(gem, distinction);
        distinction.removedGems.push(gem.clone());
    }

    performReshape() {
        for(const gem of this.gems) {
            if(gem.removed) {
                const aboveGem = this.gemAt(gem.x, gem.y + 1);
                if(!aboveGem) {
                    gem.removed = false;
                    gem.locked = true;
                    gem.type = -1;
                } else {
                    gem.type = aboveGem.type;
                    gem.locked = aboveGem.locked;
                    gem.removed = aboveGem.removed;
                    aboveGem.removed = true;
                    aboveGem.type = -1;
                }
            }
        }

        const toRemove = this.gems.find(gem => gem.removed);
        if(toRemove) {
            this.performReshape();
        }
        return false;
    }

    clone() {
        const cloned = new Grid({ size: () => 0 }, new Set());
        cloned.gems = this.gems.map(gem => gem.clone());
        cloned.gemTypes = new Set(Array.from(this.gemTypes));
        cloned.myHeroGemType = new Set(Array.from(this.myHeroGemType));
        return cloned;
    }
}