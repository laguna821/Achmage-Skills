import json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from editorial import run,prepare_svg,LayoutError
from pypdf import PdfReader
class EditorialTests(unittest.TestCase):
 def request(self,d):
  return {'outputDir':str(Path(d)/'out'),'assetRoot':d,'poster':{'editorial':{'size':'A2','title':'근거와 조건 123','language':'ko','sections':[{'id':'a','title':'검증','body':['값 42와 해석의 한계를 함께 보존한다.']}],'rows':[['a']],'references':['Source: synthetic test']}}}
 def test_text_geometry(self):
  with tempfile.TemporaryDirectory() as d:
   r=run(self.request(d));p=PdfReader(Path(d)/'out/poster.pdf').pages[0]
   self.assertTrue(r['pdfTextPreserved']);self.assertAlmostEqual(float(p.trimbox.width)*25.4/72,420,places=3);self.assertAlmostEqual(float(p.mediabox.height)*25.4/72,598,places=3)
   self.assertIn('값 42',p.extract_text());self.assertEqual(r['printStatus'],'needs-print-profile')
 def test_duplicate_id(self):
  with tempfile.TemporaryDirectory() as d:
   q=self.request(d);q['poster']['editorial']['sections']*=2
   with self.assertRaisesRegex(ValueError,'Duplicate'):run(q)
 def test_reject_figure_text_outside_viewport(self):
  with tempfile.TemporaryDirectory() as d:
   (Path(d)/'x.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="90" y="50" font-size="30">Outside numeric label</text></svg>')
   q=self.request(d);q['poster']['editorial']['figure']={'asset':'x.svg'}
   with self.assertRaisesRegex(LayoutError,'exceeds'):run(q)
 def test_reading_retains_table_semantics(self):
  with tempfile.TemporaryDirectory() as d:
   q=self.request(d);q['poster']['editorial']['sections'][0]['table']={'headers':['변수','단위'],'rows':[['연령','10년']]}
   run(q);h=(Path(d)/'out/poster.html').read_text(encoding='utf-8')
   self.assertIn('<th scope="col">변수</th>',h);self.assertIn('<th scope="row">연령</th>',h)
 def test_no_silent_overflow(self):
  with tempfile.TemporaryDirectory() as d:
   q=self.request(d);q['poster']['editorial']['sections'][0]['body']=['가나다 원문 보존 '*2000]
   with self.assertRaises(LayoutError):run(q)
   self.assertFalse(json.loads((Path(d)/'out/error.json').read_text(encoding='utf-8'))['generated'])
 def test_external_css_and_active_svg(self):
  for content in ['<image href="https://example.org/x"/>','<style>@IMPORT "https://example.org/x";</style>','<rect fill="URL(https://example.org/x)"/>']:
   with self.subTest(content=content),tempfile.TemporaryDirectory() as d:
    p=Path(d)/'x.svg';p.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">'+content+'</svg>')
    with self.assertRaises(ValueError):prepare_svg(Path('x.svg'),Path(d))
 def test_minimum_effective_label_size(self):
  with tempfile.TemporaryDirectory() as d:
   (Path(d)/'x.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="100"><text x="0" y="10" font-size="8">Too small</text></svg>')
   q=self.request(d);q['poster']['editorial']['figure']={'asset':'x.svg'}
   with self.assertRaisesRegex(LayoutError,'below'):run(q)
 def test_responsive_native_root_normalized(self):
  with tempfile.TemporaryDirectory() as d:
   (Path(d)/'x.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 30 500 100" width="500" height="100" style="font:30px sans-serif;height:auto;max-width:100%;--_s:var(--pele-surface,#eee)"><rect x="20" y="30" width="500" height="100" fill="var(--_s)"/><text x="30" y="80">Native label 42</text></svg>')
   q=self.request(d);q['poster']['editorial']['figure']={'asset':'x.svg'}
   r=run(q);self.assertTrue(r['figures'][0]['sharedNormalizedGeometry']);self.assertTrue(r['preflight']['embeddedFonts'])
if __name__=='__main__':unittest.main()
