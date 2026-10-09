import sys,json,re,tempfile,unittest,hashlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from poster_series import share_image,html_document,public_url,ROOT,sha,dump
from prepare_pages import run as stage
import test_series
from PIL import Image

class SharingTests(unittest.TestCase):
 def fixture(self,out):
  s=test_series.SeriesTests().spec();s['publishUrl']='https://achmage-slides.vercel.app/test/';s['statusLabel']='종료 행사 · 시험본'
  share=share_image(s,out);pdf=b'%PDF-test';(out/'poster.pdf').write_bytes(pdf)
  public=html_document(s,out,pdf,published=True,share=share)
  (out/'poster.html').write_text(public,encoding='utf-8')
  files={}
  for w in (400,700,800):
   name=f'pretendard-{w}.woff2';(out/name).write_bytes((ROOT/f'assets/fonts/Pretendard{w}.woff2').read_bytes());files[name]=sha(out/name)
  m={'contract':'poster-sharing-v1',**share,'publicHtmlSha256':sha(out/'poster.html'),'publicFiles':files,'pdfSha256':sha(out/'poster.pdf')};dump(out/'share-manifest.json',m)
  return s,share,m,public
 def test_public_offline_and_metadata(self):
  with tempfile.TemporaryDirectory() as tmp:
   out=Path(tmp);s,share,m,p=self.fixture(out);o=html_document(s,out,b'%PDF-test',share=share)
   self.assertLess(len(p.encode()),256*1024);self.assertLess(p.index('og:image'),4096)
   self.assertNotIn('data:font/woff2',p);self.assertIn('data:font/woff2',o)
   config=lambda x:json.loads(re.search(r'id="series-config">(.*?)</script>',x).group(1))
   self.assertEqual(config(p)['pdf'],'');self.assertTrue(config(o)['pdf'])
   self.assertEqual(p[p.index('<body>'):p.index('<script type="application/json"')],o[o.index('<body>'):o.index('<script type="application/json"')])
   with Image.open(out/share['imageFile']) as im:self.assertEqual((im.size,im.mode),((1200,600),'RGB'))
   self.assertIn(s['publishUrl']+share['imageFile'],p)
 def test_public_url_rejects_ambiguous_targets(self):
  for u in ['http://domain.test/p/','https://localhost/p/','https://user:pass@domain.test/p/','https://domain.test/p/?x=1','https://domain.test/p/#x','https://domain.test/poster.html']:
   with self.assertRaises(ValueError):public_url(u)
 def test_publisher_pins_dependencies_and_retargets_og(self):
  with tempfile.TemporaryDirectory() as tmp:
   out=Path(tmp);s,share,m,p=self.fixture(out)
   result=stage(dict(owner='laguna821',slug='poster-sharing-test',html=str(out/'poster.html'),preview=str(out/share['imageFile']),pdf=str(out/'poster.pdf'),title=s['title'],outputDir=str(out/'staged')))
   self.assertEqual(len(result['files']),6)
   published=(out/'staged/docs/poster-sharing-test/index.html').read_text(encoding='utf-8')
   self.assertIn('https://laguna821.github.io/slides/poster-sharing-test/'+share['imageFile'],published)
   self.assertNotIn('https://achmage-slides.vercel.app/test/',published)
   (out/'pretendard-400.woff2').write_bytes(b'changed')
   with self.assertRaisesRegex(ValueError,'manifest hash mismatch'):stage(dict(owner='laguna821',slug='test',html=str(out/'poster.html'),preview=str(out/share['imageFile']),title='Test',outputDir=str(out/'other')))
 def test_publisher_rejects_undeclared_assets(self):
  with tempfile.TemporaryDirectory() as tmp:
   out=Path(tmp);s,share,m,p=self.fixture(out)
   m['publicFiles']['../private.woff2']='0'*64;dump(out/'share-manifest.json',m)
   with self.assertRaisesRegex(ValueError,'Unsafe declared'):stage(dict(owner='laguna821',slug='test',html=str(out/'poster.html'),preview=str(out/share['imageFile']),title='Test',outputDir=str(out/'other')))

if __name__=='__main__':unittest.main()
