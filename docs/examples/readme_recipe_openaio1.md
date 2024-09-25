# Create Chicken Pot Pie Recipe using OpenAI-o1-preview
[Compare to GPT-4o T3](./readme_recipe_at3.md) | [Compare to GPT-4o One-Shot](./readme_recipe_oneshot.md)

## INPUT/PROMPT
The following prompt was sent to the `OpenAI-o1-preview` model. The prompt includes an example of the expected output along with some contextual tips for the desired level of detail in the final output.

```
Make classic chicken pot pie with peas carrots and corn with extra flaky crust. Include all ingredients and detailed recipe steps, all organized as escaped markdown using the following detailed format organizing subtasks using transitive subtasks.

### 1.01 Prepare the crust

#### 1.01.01 Mix dry ingredients

##### 1.01.01.04 Combine dry ingredients

In a large mixing bowl, whisk together 2 1/2 cups all-purpose flour, 1 tsp Kosher salt, and 1 tbsp sugar until well combined. Ensure there are no lumps.

**Inputs**
- 2.5 cups of all-purpose flour
- 1 tsp of Kosher salt
- 1 tbsp of sugar

**Outputs**
- 1 bowl of combined dry ingredients. 

All units are American. Specify exact quantities and recommend specific varietals that reflect a NorCal/Napa style palette (fresh); recommend Kosher salt, for example, never salt. BE concise! Never over-explain! Explain how to prep and cook, but never more! Recipe book style! Limit to 4 levels of task breakdown. Assume they are already present and gathered. Return the output as escaped markdown in the same format as provided.
```

## OpenAI-o1-preview OUTPUT
The `OpenAI-o1-preview` model generated the following output as a single response to the provided input:

### 1.01 Prepare the crust

#### 1.01.01 Mix dry ingredients

##### 1.01.01.01 Combine dry ingredients

In a large mixing bowl, whisk together 2 ½ cups all-purpose flour, 1 tsp Kosher salt, and 1 tbsp granulated sugar until well combined.

**Inputs**
- 2 ½ cups all-purpose flour
- 1 tsp Kosher salt
- 1 tbsp granulated sugar

**Outputs**
- Bowl of mixed dry ingredients

#### 1.01.02 Cut in butter

##### 1.01.02.01 Incorporate butter

Add 1 cup cold unsalted butter (cubed) to the dry mixture. Use a pastry cutter to blend until the mixture resembles coarse crumbs.

**Inputs**
- Bowl of mixed dry ingredients
- 1 cup cold unsalted butter (cubed)

**Outputs**
- Coarse crumb mixture

#### 1.01.03 Add cold water

##### 1.01.03.01 Form dough

Gradually add ½ cup ice-cold water, mixing gently until a dough forms.

**Inputs**
- Coarse crumb mixture
- ½ cup ice-cold water

**Outputs**
- Dough ball

#### 1.01.04 Chill dough

##### 1.01.04.01 Refrigerate dough

Divide the dough into two discs, wrap in plastic wrap, and refrigerate for 1 hour.

**Inputs**
- Dough ball

**Outputs**
- Two chilled dough discs

### 1.02 Prepare the filling

#### 1.02.01 Cook the chicken

##### 1.02.01.01 Prepare chicken

Season 1.5 lbs boneless, skinless chicken breasts with 1 tsp Kosher salt and ½ tsp black pepper. Cook in a skillet with 1 tbsp olive oil over medium heat until done. Dice the cooked chicken.

**Inputs**
- 1.5 lbs boneless, skinless chicken breasts
- 1 tsp Kosher salt
- ½ tsp black pepper
- 1 tbsp olive oil

**Outputs**
- Diced cooked chicken

#### 1.02.02 Prepare the vegetables

##### 1.02.02.01 Chop vegetables

Dice 1 cup fresh Napa Valley carrots and 1 cup celery. Prepare 1 cup fresh peas and 1 cup fresh corn kernels.

**Inputs**
- 1 cup fresh Napa Valley carrots
- 1 cup celery
- 1 cup fresh peas
- 1 cup fresh corn kernels

**Outputs**
- Prepared vegetables

#### 1.02.03 Make the sauce

##### 1.02.03.01 Sauté vegetables

In a saucepan, melt ½ cup unsalted butter. Add diced carrots and celery; sauté until tender.

**Inputs**
- Prepared carrots and celery
- ½ cup unsalted butter

**Outputs**
- Sautéed vegetables

##### 1.02.03.02 Create roux

Stir in ½ cup all-purpose flour; cook for 1 minute to form a roux.

**Inputs**
- Sautéed vegetables
- ½ cup all-purpose flour

**Outputs**
- Roux with vegetables

##### 1.02.03.03 Add liquids

Gradually whisk in 2 cups low-sodium chicken broth and 1 ½ cups whole milk. Cook until thickened.

**Inputs**
- Roux with vegetables
- 2 cups low-sodium chicken broth
- 1 ½ cups whole milk

**Outputs**
- Thickened sauce

#### 1.02.04 Combine filling ingredients

##### 1.02.04.01 Complete filling

Add diced chicken, peas, and corn to the sauce. Stir in 1 tsp fresh thyme leaves from Napa Valley and season with 1 tsp Kosher salt.

**Inputs**
- Thickened sauce
- Diced cooked chicken
- 1 cup fresh peas
- 1 cup fresh corn kernels
- 1 tsp fresh thyme leaves
- 1 tsp Kosher salt

**Outputs**
- Chicken pot pie filling

### 1.03 Assemble and bake

#### 1.03.01 Roll out crusts

##### 1.03.01.01 Prepare bottom crust

On a floured surface, roll out one dough disc to fit a 9-inch pie dish. Place it into the dish.

**Inputs**
- One chilled dough disc
- Flour for dusting

**Outputs**
- Pie dish with bottom crust

#### 1.03.02 Add filling

##### 1.03.02.01 Fill pie

Pour filling into the crust-lined pie dish.

**Inputs**
- Pie dish with bottom crust
- Chicken pot pie filling

**Outputs**
- Filled pie dish

#### 1.03.03 Add top crust

##### 1.03.03.01 Cover pie

Roll out the second dough disc and place over filling. Seal edges and cut slits on top.

**Inputs**
- Filled pie dish
- Second chilled dough disc

**Outputs**
- Assembled pot pie

#### 1.03.04 Bake the pie

##### 1.03.04.01 Bake

Bake at 375°F for 45–50 minutes until crust is golden.

**Inputs**
- Assembled pot pie
- Preheated oven at 375°F

**Outputs**
- Baked chicken pot pie
