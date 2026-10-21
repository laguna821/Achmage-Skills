"""CPU timeline semantics test; no renderer or extra dependencies required."""
import ast,pathlib,unittest
source=pathlib.Path(__file__).resolve().parents[1]/'scripts/skia_frames.py'
tree=ast.parse(source.read_text(encoding='utf-8'))
selected=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['smooth','state'] or isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='DEFAULTS' for t in n.targets)]
space={};exec(compile(ast.Module(body=selected,type_ignores=[]),str(source),'exec'),space)
class Timeline(unittest.TestCase):
 def value(self,ease,t):
  return space['state']({'keyframes':[{'at':4,'x':100,'ease':ease}]},t)['x']
 def test_easing_contract(self):
  self.assertEqual(self.value('linear',1),25)
  self.assertEqual(self.value('hold',3.99),0)
  self.assertEqual(self.value('hold',4),100)
  self.assertAlmostEqual(self.value('out',1),57.8125)
  self.assertAlmostEqual(self.value('smooth',1),15.625)
 def test_no_cumulative_state(self):
  for t in [3,.5,2,3,.5]:self.assertEqual(self.value('linear',t),t*25)
 def test_segments_are_opt_in(self):
  l={'keyframes':[{'at':2,'opacity':.5},{'at':4,'x':100,'ease':'linear'}]}
  self.assertEqual(space['state'](l,1)['x'],25)
  self.assertEqual(space['state'](l,1,'segments-v1')['x'],0)
  self.assertEqual(space['state'](l,3,'segments-v1')['x'],50)
 def test_legacy_smooth_unchanged(self):
  self.assertEqual(space['state']({'keyframes':[{'at':4,'x':100}]},1)['x'],15.625)
if __name__=='__main__':unittest.main()

