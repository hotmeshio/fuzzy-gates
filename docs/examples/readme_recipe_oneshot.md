# Create Chicken Pot Pie Recipe using GPT-4o One-Shot
[Compare to GPT-4o T3](./readme_recipe_at3.md) | [Compare to OpenAI-o1-preview](./readme_recipe_gpto1.md)

## INPUT/PROMPT
The following prompt was sent to the `GPT-4o` model. The prompt includes an example of the expected output along with some contextual tips for the desired level of detail in the final output.

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

All units are American. Specify exact quantities and recommend specific varietals that reflect a NorCal/Napa style palette (fresh); recommend Kosher salt, for example, never salt. BE concise! Never overexplain! Explain how to prep and cook, but never more! Recipe book style! Limit to 4 levels of task breakdown. Assume they are already present and gathered. Return the output as escaped markdown in the same format as provided.
```

## GPT-4o OUTPUT
The `GPT-4o` model generated the following output as a single response to the provided input:

### 1.01 Prepare the crust

#### 1.01.01 Mix dry ingredients

##### 1.01.01.04 Combine dry ingredients
In a large mixing bowl, whisk together 2 1/2 cups all-purpose flour, 1 tsp Kosher salt, and 1 tbsp sugar until well combined. Ensure there are no lumps.

**Inputs**
- 2 1/2 cups all-purpose flour
- 1 tsp Kosher salt
- 1 tbsp sugar

**Outputs**
- 1 bowl of combined dry ingredients.

#### 1.01.02 Cut in butter

##### 1.01.02.04 Incorporate butter
Add 1 cup (2 sticks) cold, unsalted butter cut into cubes. Use a pastry cutter or your hands to blend until the mixture resembles coarse crumbs with some pea-sized pieces.

**Inputs**
- 1 cup cold unsalted butter, cubed

**Outputs**
- Coarse crumb mixture with butter.

#### 1.01.03 Add water and form dough

##### 1.01.03.04 Bind with water
Gradually add 1/4 to 1/2 cup ice water, 1 tbsp at a time, mixing gently until the dough begins to clump together. Do not overwork. Split into two discs, wrap in plastic, and chill for at least 1 hour.

**Inputs**
- 1/4 to 1/2 cup ice water

**Outputs**
- 2 discs of dough, chilled.

### 1.02 Prepare the filling

#### 1.02.01 Cook chicken

##### 1.02.01.04 Sear and cook
In a skillet, heat 1 tbsp olive oil. Add 1 lb chicken breast, season with salt and pepper, and cook until browned and cooked through (165°F), about 6-8 minutes per side. Let rest, then shred into bite-sized pieces.

**Inputs**
- 1 tbsp olive oil
- 1 lb chicken breast
- Salt and pepper to taste

**Outputs**
- Shredded cooked chicken.

#### 1.02.02 Cook vegetables

##### 1.02.02.04 Sauté vegetables
In the same skillet, melt 4 tbsp unsalted butter. Add 1 cup diced carrots, 1 cup diced celery, 1/2 cup diced onion, and cook until soft, about 5 minutes. Stir in 1 cup frozen peas and 1 cup frozen corn; cook for 2 minutes.

**Inputs**
- 4 tbsp unsalted butter
- 1 cup diced carrots
- 1 cup diced celery
- 1/2 cup diced onion
- 1 cup frozen peas
- 1 cup frozen corn

**Outputs**
- Sautéed vegetables.

#### 1.02.03 Make the sauce

##### 1.02.03.04 Prepare roux
Sprinkle 1/3 cup all-purpose flour over the vegetables and stir until fully incorporated, cooking for 1 minute. Slowly whisk in 2 cups chicken broth and 1 cup whole milk, stirring until the mixture thickens, about 5-7 minutes. Season with salt, pepper, and 1 tsp chopped fresh thyme.

**Inputs**
- 1/3 cup all-purpose flour
- 2 cups chicken broth
- 1 cup whole milk
- 1 tsp fresh thyme, chopped
- Salt and pepper to taste

**Outputs**
- Thickened sauce.

#### 1.02.04 Combine chicken and sauce

##### 1.02.04.04 Mix filling components
Fold shredded chicken into the sauce, mixing thoroughly to combine.

**Inputs**
- Shredded chicken
- Thickened sauce

**Outputs**
- Combined chicken pot pie filling.

### 1.03 Assemble and bake

#### 1.03.01 Roll out crust

##### 1.03.01.04 Roll and position
On a floured surface, roll out one disc of dough into a 12-inch circle. Transfer to a 9-inch pie dish, pressing gently into the corners.

**Inputs**
- 1 dough disc

**Outputs**
- Pie dish lined with crust.

#### 1.03.02 Add filling and top crust

##### 1.03.02.04 Layer and seal
Pour the filling into the prepared crust. Roll out the second disc and place it over the filling. Trim excess and crimp edges to seal. Cut a few slits in the top for venting.

**Inputs**
- Combined filling
- Second dough disc

**Outputs**
- Assembled pie, ready to bake.

#### 1.03.03 Bake the pie

##### 1.03.03.04 Bake to golden perfection
Brush the top with beaten egg and bake in a preheated oven at 400°F for 35-40 minutes or until the crust is golden brown. Let cool slightly before serving.

**Inputs**
- 1 beaten egg (for brushing)

**Outputs**
- Baked chicken pot pie with flaky crust.
