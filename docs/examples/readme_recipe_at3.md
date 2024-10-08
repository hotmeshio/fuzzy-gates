# Create Chicken Pot Pie Recipe using GPT-4o T3
[Compare to GPT-4o One-Shot](./readme_recipe_oneshot.md) | [Compare to OpenAI-o1-preview](./readme_recipe_gpto1.md)

## INPUT/PROMPT
The following prompt was executed recursively (one sub-task at a time) in order to generate the output shown in this file. 

```
GENERATION REQUEST > 
#ROLE :: Evaluator
#CONTEXT :: All units are American. Specify exact quantities and recommend specific varietals that reflect a NorCal/Napa style palette (fresh); recommend Kosher salt, for example, never salt. BE concise! Never overexplain! Explain how to prep and cook, but never more! Recipe book style! Limit to 4 levels of task breakdown. Assume they are already present and gathered.
#CUSTOMER REQUEST :: Make classic chicken pot pie with peas carrots and corn with extra flaky crust
#CURRENT TASK ANCESTRAL CONTEXT :: 
#PRECEDING SIBLING TASK :: -
#CURRENT TASK :: Make classic chicken pot pie with peas carrots and corn with extra flaky crust
#FOLLOWING SIBLING TASK :: -
#CURRENT TASK DEPTH/POSITION :: 1
#ASSIGNMENT :: Determine whether the CURRENT TASK can be executed without confusion as a single transitive task or if it should be broken down into subtasks. Subtasks must be transitive/transformative and assumed to have defined inputs/states and defined outputs/states. RETURN final instructions, not subtasks, if depth > 4 levels. Never overexplain! Anticipate eventual Depth Limit during earlier steps and adjust subtask granularity as needed.
#RESPONSE FORMAT IF SUFFICIENTLY GRANULAR :: { "instructions": "...", "inputs": [{"item": "", "quantity": #, "unit": ""},], "outputs": [{"item": "", "quantity": #, "unit": ""},] }
#RESPONSE FORMAT OTHERWISE :: { "tasks": ["...", "...",] }
```

## T3 Prompt OUTPUT
The OUTPUT shown below was generated by stringifying the tasks in the transitive task tree. Importantly, any single task shown here can be subtasked, clarified or pruned using T3 as the task tree is retained locally in an editable state:

### 1.01 Prepare the crust

#### 1.01.01 Mix dry ingredients

##### 1.01.01.04 Combine dry ingredients

In a large mixing bowl, whisk together 2 1/2 cups all-purpose flour, 1 tsp Kosher salt, and 1 tbsp sugar until well combined. Ensure there are no lumps.

**Inputs**
- 2.5 cups of all-purpose flour
- 1 tsp of Kosher salt
- 1 tbsp of sugar

**Outputs**
- 1 bowl of combined dry ingredients

#### 1.01.02 Cut in butter

Cut 1 cup (2 sticks) of unsalted butter into small cubes and add them to the dry ingredients. Use a pastry cutter or your fingers to blend the butter into the flour mixture until it resembles coarse crumbs.

**Inputs**
- 1 cup of unsalted butter
- 1 bowl of dry ingredients mixture

**Outputs**
- 1 bowl of butter and dry ingredients mixture

#### 1.01.03 Add water and form dough

##### 1.01.03.01 Drizzle ice water over flour-butter mixture

Drizzle 1/4 cup of ice water over the flour-butter mixture. Add more ice water, 1 tablespoon at a time, if needed, until the dough begins to come together.

**Inputs**
- 0.25 cup of ice water


##### 1.01.03.02 Mix until dough forms

#### 1.01.04 Chill dough

Wrap the dough in plastic wrap and chill in the refrigerator for at least 1 hour. This helps the dough firm up and makes it easier to roll out.

**Inputs**
- 1 batch of dough

**Outputs**
- 1 batch of chilled dough

### 1.02 Prepare the filling

#### 1.02.01 Cook the chicken

##### 1.02.01.01 Season chicken with Kosher salt and black pepper.

Season chicken breasts with 1 tsp Kosher salt and 1/2 tsp black pepper on both sides.

**Inputs**
- 1.5 lbs of chicken
- 1 tsp of Kosher salt
- 0.5 tsp of black pepper

**Outputs**
- 1.5 lbs of seasoned chicken

##### 1.02.01.02 Heat 2 tbsp olive oil in a large skillet over medium-high heat.

Heat 2 tbsp olive oil in a large skillet over medium-high heat until shimmering.

**Inputs**
- 2 tbsp of olive oil


##### 1.02.01.03 Cook chicken breasts for 6-7 minutes per side until golden brown and cooked through.

Cook chicken breasts for 6-7 minutes per side until golden brown and cooked through. The internal temperature should reach 165°F.

**Inputs**
- 2 pieces of chicken breasts

**Outputs**
- 2 pieces of cooked chicken breasts

##### 1.02.01.04 Remove chicken from skillet and let rest for 5 minutes.

Remove chicken from skillet and let rest for 5 minutes before dicing.

**Inputs**
- 2 pieces of cooked chicken breasts

**Outputs**
- 2 pieces of rested chicken breasts

##### 1.02.01.05 Dice chicken into bite-sized pieces.

Dice the rested chicken into bite-sized pieces.

**Inputs**
- 2 pieces of cooked chicken breasts

**Outputs**
- 2 cups of diced chicken

#### 1.02.02 Prepare the vegetables

##### 1.02.02.01 Peel and dice carrots

Peel 2 large carrots and dice them into 1/4-inch pieces.

**Inputs**
- 2 large of carrots

**Outputs**
- 2 cups of diced carrots

##### 1.02.02.02 Shuck and cut corn kernels

Shuck the corn and remove all silk. Stand the cob upright on a cutting board. Using a sharp knife, cut downwards to remove the kernels. Rotate the cob and repeat until all kernels are removed. You should have about 1 cup of kernels.

**Inputs**
- 2 whole of corn cobs

**Outputs**
- 2 cups of corn kernels

##### 1.02.02.03 Shell peas

Shell the peas by removing them from their pods. Discard the pods. You should have about 1 cup of shelled peas.

**Inputs**
- 2 cups of fresh peas

**Outputs**
- 2 cups of shelled peas

#### 1.02.03 Make the sauce

##### 1.02.03.01 Melt butter in a saucepan over medium heat.

Melt 6 tablespoons of unsalted butter in a saucepan over medium heat until fully melted and bubbling, about 2-3 minutes. Do not let the butter brown.

**Inputs**
- 6 tablespoons of unsalted butter

**Outputs**
- 6 tablespoons of melted butter

##### 1.02.03.02 Whisk in flour to form a roux.

Whisk in 1/2 cup of all-purpose flour to form a roux, cooking for 2-3 minutes until golden and bubbly. Stir constantly to prevent burning.

**Inputs**
- 0.5 cup of all-purpose flour

**Outputs**
- 0.5 cup of roux

##### 1.02.03.03 Gradually add chicken broth, whisking constantly.

Gradually add 2 cups of chicken broth, whisking constantly until smooth. Ensure there are no lumps.

**Inputs**
- 2 cups of chicken broth

**Outputs**
- 2 cups of smooth sauce

##### 1.02.03.04 Add milk and continue to whisk until thickened.

Add 1 cup of milk and continue to whisk until the mixture thickens, about 5-7 minutes. The mixture should coat the back of a spoon.

**Inputs**
- 1 cup of milk

**Outputs**
- 2 cups of thickened sauce

##### 1.02.03.05 Season with Kosher salt and freshly ground black pepper.

Season with 1 teaspoon Kosher salt and 1/2 teaspoon freshly ground black pepper. Stir well to combine and taste to adjust seasoning if necessary.

**Inputs**
- 1 teaspoon of Kosher salt
- 0.5 teaspoon of freshly ground black pepper


### 1.03 Assemble and bake the pot pie

#### 1.03.01 Preheat oven to 400°F

Preheat oven to 400°F (200°C).



#### 1.03.02 Roll out bottom crust and place in pie dish

Roll out the bottom crust on a lightly floured surface to fit your pie dish. Place the rolled-out crust into the pie dish, pressing it gently to fit snugly. Trim any excess dough hanging over the edges.

**Inputs**
- 1 portion of pie crust dough

**Outputs**
- 1 prepared of pie dish with bottom crust

#### 1.03.03 Add prepared filling to pie dish

Add the prepared filling to the pie dish, spreading it evenly. Ensure the filling is level.

#### 1.03.04 Roll out top crust and cover filling

##### 1.03.04.01 Roll out top crust to 1/8-inch thickness

On a lightly floured surface, roll out the top crust to 1/8-inch thickness. Ensure it is large enough to cover the pie.

**Inputs**
- 1 cup of flour

**Outputs**
- 1 piece of rolled crust

##### 1.03.04.02 Place rolled crust over filling

Place the rolled crust gently over the filling, ensuring it covers the edges. Trim any excess dough, leaving a 1-inch overhang. Tuck the overhang under itself to form a thick edge. Crimp or flute the edges to seal. Ensure the crust is sealed well to prevent leaks.

**Inputs**
- 1 piece of rolled crust
- 1 pie of filling

**Outputs**
- 1 piece of covered pie

#### 1.03.05 Seal edges and cut slits for steam

Seal the edges of the pie by pressing them together with a fork or your fingers. Cut 4-5 small slits in the top crust to allow steam to escape during baking.

**Inputs**
- 1 whole of pie with top crust

**Outputs**
- 1 whole of sealed and vented pie

#### 1.03.06 Brush top with egg wash

Brush the top of the pot pie with egg wash (1 beaten egg mixed with 1 tablespoon of water) to give it a golden brown finish.

**Inputs**
- 1 large of egg
- 1 tbsp of water

**Outputs**
- 1 whole of pot pie with egg wash

#### 1.03.07 Bake for 35-40 minutes until golden brown

Bake for 35-40 minutes until the crust is golden brown and the filling is bubbling. Let the pie cool for 10-15 minutes before serving.

**Inputs**
- 1 whole of pot pie

**Outputs**
- 1 whole of baked pot pie
